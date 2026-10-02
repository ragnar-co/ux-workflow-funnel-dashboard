import { useEffect, useMemo, useState } from "react";
import { ADD_NPS_FIELDS } from "../../domain/importPipeline.js";
import { FormSelect } from "../../components/FormSelect.jsx";
import { ToolbarIcon } from "../../components/ToolbarIcon.jsx";
import { rescale1to5To10, rescale0to5To10, getNpsCategory } from "../../domain/nps.js";
import { useAppState } from "../../store/AppStateContext.jsx";

const FIELD_ICON = {
  customer_name: "owner",
  nps_score: "status",
  comment: "tag",
  team_name: "team",
  nps_reason: "tag",
  q_speaker: "status",
  q_logistics: "calendar",
  q_usefulness: "status"
};

const SCALE_OPTIONS = [
  { value: "0-10", label: "0–10 (already NPS scale)" },
  { value: "0-5", label: "0–5 scale" },
  { value: "1-5", label: "1–5 scale" }
];

const SCALE_LABEL = { "0-10": "0–10", "0-5": "0–5", "1-5": "1–5" };

// The 3 fields Ragnar needs to compute NPS at all — shown first, full visual weight.
const REQUIRED_KEYS = ["customer_name", "nps_score", "comment"];
const REQUIRED_FIELDS = ADD_NPS_FIELDS.filter((f) => REQUIRED_KEYS.includes(f.key));

// Optional signals that sharpen Root Cause detection for detractors — tucked into a
// collapsed accordion so they don't compete visually with the required fields above.
const DRIVER_KEYS = ["nps_reason", "q_speaker", "q_logistics", "q_usefulness"];
const DRIVER_FIELDS = ADD_NPS_FIELDS.filter((f) => DRIVER_KEYS.includes(f.key));

function normalizeTeamName(text) {
  return String(text || "").trim().toLowerCase();
}

function MappingRow({ label, children, last }) {
  return (
    <div className={`flex items-start gap-3 px-3 py-2.5 ${last ? "" : "border-b border-line"}`}>
      <span className="w-[132px] shrink-0 pt-1.5 text-sm font-semibold text-ink">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function MapQuestionsStep({ headers, rows, product, surveyType, initialMapping, initialScale, onBack, onContinue }) {
  const { products } = useAppState();
  const isEvent = surveyType === "event";
  const requiredFields = REQUIRED_FIELDS.map((f) => (isEvent && f.key === "customer_name" ? { ...f, label: "Company Name" } : f));
  const [mapping, setMapping] = useState(initialMapping);
  const [scale, setScale] = useState(initialScale || "0-10");
  const [scaleTouched, setScaleTouched] = useState(false);
  const [showScalePanel, setShowScalePanel] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDrivers, setShowDrivers] = useState(() => DRIVER_KEYS.some((k) => initialMapping[k]) || Boolean(initialMapping.team_name));

  const fieldOptions = useMemo(
    () => [{ value: "", label: "— Not mapped —" }, ...headers.map((h) => ({ value: h, label: h }))],
    [headers]
  );

  const scoreRange = useMemo(() => {
    if (!mapping.nps_score || !rows?.length) return null;
    const values = rows.map((r) => Number(r[mapping.nps_score])).filter((v) => !Number.isNaN(v));
    if (!values.length) return null;
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [rows, mapping.nps_score]);

  useEffect(() => {
    if (!scoreRange || scaleTouched) return;
    if (scoreRange.max > 5) setScale("0-10");
    else setScale(scoreRange.min <= 0 ? "0-5" : "1-5");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoreRange]);

  const set = (key) => (e) => {
    const value = e.target.value;
    setMapping((prev) => ({ ...prev, [key]: value }));
    if (key === "nps_score") setScaleTouched(false);
  };

  const chooseScale = (value) => {
    setScale(value);
    setScaleTouched(true);
    setShowPreview(false);
    setShowScalePanel(false);
  };

  const requiredOk = mapping.customer_name && mapping.nps_score;

  const matchedProduct = useMemo(() => products.find((p) => p.name === product), [products, product]);
  const configuredTeams = matchedProduct?.teams || [];

  const teamCheck = useMemo(() => {
    if (!matchedProduct || !mapping.team_name || !rows?.length) return null;
    const values = [...new Set(rows.map((r) => String(r[mapping.team_name] ?? "").trim()).filter(Boolean))];
    if (!values.length) return null;
    const configuredSet = new Set(configuredTeams.map(normalizeTeamName));
    return values.map((value) => ({ value, known: configuredSet.has(normalizeTeamName(value)) }));
  }, [mapping.team_name, rows, configuredTeams]);

  const rescaleFn = scale === "1-5" ? rescale1to5To10 : scale === "0-5" ? rescale0to5To10 : null;

  const conversionPreview = useMemo(() => {
    if (!rescaleFn || !mapping.nps_score || !rows?.length) return null;
    const values = rows.map((r) => Number(r[mapping.nps_score])).filter((v) => !Number.isNaN(v));
    if (!values.length) return null;
    const mappingList = [...new Set(values)].sort((a, b) => a - b).map((raw) => ({ raw, converted: rescaleFn(raw) }));
    const converted = values.map(rescaleFn);
    return {
      mappingList,
      total: values.length,
      promoters: converted.filter((v) => getNpsCategory(v) === "promoter").length,
      passives: converted.filter((v) => getNpsCategory(v) === "passive").length,
      detractors: converted.filter((v) => getNpsCategory(v) === "detractor").length
    };
  }, [rescaleFn, rows, mapping.nps_score]);

  const scoreHelperText = mapping.nps_score
    ? rescaleFn
      ? `Detected scale: ${SCALE_LABEL[scale]}. Scores will be converted to 0–10 NPS automatically.`
      : "Detected scale: 0–10. Already on the NPS scale."
    : null;

  const driverRows = [
    ...(!isEvent ? [{ key: "team_name", label: "Team / Owner" }] : []),
    ...DRIVER_FIELDS
  ];

  return (
    <div>
      <h3 className="text-sm font-bold mb-1">Map Questions</h3>
      <p className="text-xs text-muted mb-4">จับคู่คอลัมน์จากไฟล์กับข้อมูลที่ระบบต้องใช้ในการวิเคราะห์</p>

      <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-1.5">Required Fields</p>
      <div className="mb-4 rounded-input border border-line bg-surface overflow-hidden">
        {requiredFields.map(({ key, label }, index) => (
          <MappingRow key={key} label={label} last={index === requiredFields.length - 1 && key !== "nps_score"}>
            <FormSelect icon={FIELD_ICON[key] || "tag"} value={mapping[key] || ""} onChange={set(key)} options={fieldOptions} />

            {key === "nps_score" && (
              <>
                {scoreHelperText && <p className="mt-1.5 text-[11px] text-muted leading-snug">{scoreHelperText}</p>}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-muted">Score scale</span>
                  <span className="inline-flex items-center rounded-full border border-line bg-workspace px-2 py-0.5 text-[11px] font-bold text-ink">
                    {scaleTouched ? "Set" : "Auto detected"}: {SCALE_LABEL[scale]}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowScalePanel((v) => !v)}
                    className="text-[11px] font-bold text-brand-blue hover:underline"
                  >
                    {showScalePanel ? "Close" : "Change"}
                  </button>
                </div>

                {showScalePanel && (
                  <div className="mt-2 rounded-input border border-line bg-surface px-3 py-2.5">
                    <div className="flex flex-wrap gap-4">
                      {SCALE_OPTIONS.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                          <input type="radio" name="score-scale" checked={scale === opt.value} onChange={() => chooseScale(opt.value)} />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                    {scoreRange && (
                      <p className="mt-2 text-xs text-muted">
                        Detected values in this column: {scoreRange.min}–{scoreRange.max}
                        {!scaleTouched && scoreRange.max <= 5 && (scoreRange.min <= 0
                          ? " — looks like a 0-5 scale, auto-selected above."
                          : " — looks like a 1-5 scale, auto-selected above.")}
                      </p>
                    )}
                  </div>
                )}

                {rescaleFn && conversionPreview && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setShowPreview((v) => !v)}
                      className="text-[11px] font-bold text-brand-blue hover:underline"
                    >
                      {showPreview ? "Hide conversion preview" : "View conversion preview"}
                    </button>

                    {showPreview && (
                      <div className="mt-2 rounded-input border border-line bg-workspace px-3 py-2.5">
                        <p className="text-xs text-muted mb-2">
                          Every score below will be standardized to the 0-10 NPS scale before saving:
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {conversionPreview.mappingList.map(({ raw, converted }) => (
                            <span key={raw} className="inline-flex items-center gap-1 rounded-input bg-surface border border-line px-2 py-1 text-xs font-semibold">
                              {raw} <span className="text-muted">→</span> <span className="text-brand-blue">{converted}</span>
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs">
                          <span className="font-bold text-brand-green">{conversionPreview.promoters} Promoters</span>
                          <span className="font-bold text-brand-amber">{conversionPreview.passives} Passives</span>
                          <span className="font-bold text-ragnar-red">{conversionPreview.detractors} Detractors</span>
                          <span className="text-muted">({conversionPreview.total} responses)</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </MappingRow>
        ))}
      </div>

      <div className="mb-6 rounded-input border border-line bg-surface overflow-hidden">
        <button
          type="button"
          onClick={() => setShowDrivers((v) => !v)}
          className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left"
        >
          <div>
            <p className="text-xs font-bold text-ink">Optional: NPS Drivers</p>
            <p className="mt-0.5 text-[11px] text-muted leading-snug">
              เพิ่มข้อมูลเสริมเพื่อช่วยวิเคราะห์สาเหตุของคะแนน โดยเฉพาะกลุ่ม Passive และ Detractor
            </p>
          </div>
          <ToolbarIcon id={showDrivers ? "chevronUp" : "chevronDown"} className="h-4 w-4 shrink-0 mt-0.5 text-muted" />
        </button>

        {showDrivers && (
          <div className="border-t border-line">
            {driverRows.map(({ key, label }, index) => (
              <MappingRow key={key} label={label} last={index === driverRows.length - 1}>
                <FormSelect icon={FIELD_ICON[key] || "tag"} value={mapping[key] || ""} onChange={set(key)} options={fieldOptions} />
                {key === "team_name" && teamCheck && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {teamCheck.map(({ value, known }) => (
                      <span
                        key={value}
                        className={`inline-flex items-center gap-1 rounded-input border px-2 py-1 text-xs font-semibold ${
                          known ? "border-brand-green/30 bg-brand-green-soft text-brand-green" : "border-brand-amber/30 bg-brand-amber-soft text-brand-amber"
                        }`}
                      >
                        {value} {known ? "✓" : "— not in system"}
                      </span>
                    ))}
                  </div>
                )}
              </MappingRow>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onBack} className="btn-secondary">← Back</button>
        <button disabled={!requiredOk} onClick={() => onContinue(mapping, scale)} className="btn-primary ml-auto">Next →</button>
      </div>
    </div>
  );
}
