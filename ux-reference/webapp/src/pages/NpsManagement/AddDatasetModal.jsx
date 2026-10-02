import { useState } from "react";
import { Modal } from "../../components/Modal.jsx";
import { ModalStepper } from "./ModalStepper.jsx";
import { SurveyTypeStep } from "./SurveyTypeStep.jsx";
import { AttachFileStep } from "./AttachFileStep.jsx";
import { DatasetDetailsStep } from "./DatasetDetailsStep.jsx";
import { MapQuestionsStep } from "./MapQuestionsStep.jsx";
import { DatasetReviewStep } from "./DatasetReviewStep.jsx";
import { useAppState } from "../../store/AppStateContext.jsx";
import { buildAddNpsDraftResults } from "../../domain/importPipeline.js";
import { getQuarterTag, getMonthTag } from "../../domain/nps.js";
import { getDefaultMetrics } from "../../domain/surveys.js";

const STEPS = ["Type", "Attach File", "Details", "Map", "Analyze"];
const STEP_INDEX = { type: 0, attach: 1, details: 2, map: 3, analyze: 4 };

export function AddDatasetModal({ open, onClose, onSaved }) {
  const { importResponses, addEvent, addDataset } = useAppState();
  const [step, setStep] = useState("type");
  const [surveyType, setSurveyType] = useState(null);
  const [details, setDetails] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [scoreScale, setScoreScale] = useState("0-10");
  const [rows, setRows] = useState([]);

  const reset = () => {
    setStep("type");
    setSurveyType(null);
    setDetails(null);
    setUploaded(null);
    setMapping(null);
    setScoreScale("0-10");
    setRows([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = (finalRows) => {
    const datasetId = crypto.randomUUID();
    const period = surveyType === "event" ? getMonthTag(details.eventDate) : details.period;
    const quarterTag = surveyType === "event" ? getQuarterTag(details.eventDate) : details.period;

    const draftResults = buildAddNpsDraftResults(finalRows, {
      quarterTag,
      product: details.product,
      npsType: surveyType,
      surveyPeriod: details.period,
      eventName: surveyType === "event" ? details.eventName : null,
      eventDate: details.eventDate,
      datasetId
    });

    if (draftResults.length) {
      importResponses(draftResults, { source: surveyType === "event" ? "metasurvey" : "upload" });
    }

    if (surveyType === "event" && draftResults.length) {
      addEvent({
        id: crypto.randomUUID(),
        name: details.eventName,
        date: details.eventDate,
        description: details.description || "",
        product: details.product,
        team: "",
        documentName: null,
        responseCount: draftResults.length,
        createdAt: new Date().toISOString().slice(0, 10)
      });
    }

    const included = finalRows.filter((r) => !r.excluded).length;
    const hasIssues = finalRows.some((r) => !r.excluded && r.status !== "Ready");

    const excludedResponses = finalRows.filter((r) => r.excluded).map((r) => ({
      customer: r.customer_name || "—",
      owner: r.team_name || "Unassigned",
      score: r.nps_score,
      comment: r.comment,
      date: r.submitted_at,
      reason: r.flags?.includes("duplicate") ? "Duplicate" : r.status
    }));

    addDataset({
      id: datasetId,
      type: surveyType,
      product: details.product,
      period,
      surveyPeriod: details.period,
      eventDate: details.eventDate,
      datasetName: details.datasetName,
      fileName: uploaded?.parsed?.fileName || null,
      description: details.description || "",
      responses: finalRows.length,
      validResponses: included,
      metrics: getDefaultMetrics(surveyType),
      status: hasIssues ? "Needs Review" : "Ready",
      excludedResponses
    });

    onSaved();
    reset();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Survey">
      <ModalStepper steps={STEPS} activeIndex={Math.min(STEP_INDEX[step] ?? 0, STEPS.length)} />

      {step === "type" && (
        <SurveyTypeStep value={surveyType} onCancel={handleClose} onContinue={(type) => { setSurveyType(type); setStep("attach"); }} />
      )}

      {step === "attach" && (
        <AttachFileStep
          surveyType={surveyType}
          initialUpload={uploaded}
          onBack={() => setStep("type")}
          onContinue={(uploadData) => {
            const prevParsed = uploaded?.parsed;
            const fileChanged = !prevParsed || prevParsed.fileName !== uploadData.parsed.fileName || prevParsed.fileSize !== uploadData.parsed.fileSize;
            setUploaded(uploadData);
            setMapping(uploadData.parsed.mapping);
            if (fileChanged) setDetails(null);
            setStep("details");
          }}
        />
      )}

      {step === "details" && (
        <DatasetDetailsStep
          surveyType={surveyType}
          initial={details}
          uploaded={uploaded}
          onBack={() => setStep("attach")}
          onContinue={(form) => {
            setDetails(form);
            setStep("map");
          }}
        />
      )}

      {step === "map" && uploaded && (
        <MapQuestionsStep
          headers={uploaded.parsed.headers}
          rows={uploaded.parsed.rows}
          product={details?.product}
          surveyType={surveyType}
          initialMapping={mapping}
          initialScale={scoreScale}
          onBack={() => setStep("details")}
          onContinue={(newMapping, newScale) => { setMapping(newMapping); setScoreScale(newScale); setStep("analyze"); }}
        />
      )}

      {step === "analyze" && uploaded && (
        <DatasetReviewStep
          surveyType={surveyType}
          parsed={uploaded.parsed}
          mapping={mapping}
          scoreScale={scoreScale}
          initialRows={rows.length ? rows : null}
          onBack={() => setStep("map")}
          onContinue={(finalRows) => { setRows(finalRows); handleSave(finalRows); }}
        />
      )}
    </Modal>
  );
}
