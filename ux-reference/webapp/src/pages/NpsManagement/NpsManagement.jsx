import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { useAppState } from "../../store/AppStateContext.jsx";
import { getCasePriorityRank, getNpsType } from "../../domain/nps.js";
import { buildDatasetRows, summarizeDatasetRows, buildDatasetCsv, buildDatasetMarkdown } from "../../domain/datasetReport.js";
import { buildDatasetRowReport, buildRowReportCsv, buildRowReportMarkdown } from "../../domain/datasetRowReport.js";
import { downloadFile, slugifyFileName } from "../../domain/exportUtils.js";
import { getDatasetPeriod } from "../../domain/surveys.js";
import { DatasetToolbar } from "./DatasetToolbar.jsx";
import { DatasetTable } from "./DatasetTable.jsx";
import { AddDatasetModal } from "./AddDatasetModal.jsx";
import { DatasetExportReport } from "./DatasetExportReport.jsx";
import { DatasetRowExportReport, EventReportContent } from "./DatasetRowExportReport.jsx";
import { MetricCard } from "../../components/MetricCard.jsx";
import { UnderlineTabs } from "../../components/UnderlineTabs.jsx";
import { Modal } from "../../components/Modal.jsx";
import { Pagination } from "../../components/Pagination.jsx";
import { useSort, usePagination } from "../../hooks/useTableControls.js";

const TYPE_OPTIONS = [
  { value: "satisfaction", label: "Customer Satisfaction" },
  { value: "event", label: "Event Feedback" }
];

function getSortValue(d, key) {
  if (key === "responses") return d.responses || 0;
  return d[key] || "";
}

export function NpsManagement() {
  const { datasets, responses, removeDataset, appConfig } = useAppState();
  const tabs = useMemo(
    () => [{ id: "all", label: "All Surveys" }, ...appConfig.surveyTypes.map((t) => ({ id: t.id, label: t.label }))],
    [appConfig]
  );
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(TYPE_OPTIONS.map((o) => o.value));
  const [periodFilter, setPeriodFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [toast, setToast] = useState("");
  const [printMode, setPrintMode] = useState(null);
  const [printingRow, setPrintingRow] = useState(null);
  const [sort, onSort] = useSort("datasetName", "asc");

  const statusOptions = useMemo(
    () => [...new Set(datasets.map((d) => d.status))].map((s) => ({ value: s, label: s })),
    [datasets]
  );
  const [statusFilter, setStatusFilter] = useState([]);
  useEffect(() => { setStatusFilter(statusOptions.map((o) => o.value)); }, [statusOptions]);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter(TYPE_OPTIONS.map((o) => o.value));
    setStatusFilter(statusOptions.map((o) => o.value));
    setPeriodFilter("all");
  };

  useEffect(() => {
    resetFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const scoped = tab === "all" ? datasets : datasets.filter((d) => d.type === tab);

  const periodOptions = useMemo(
    () => [...new Set(scoped.map((d) => getDatasetPeriod(d)).filter(Boolean))].sort().map((p) => ({ value: p, label: p })),
    [scoped]
  );

  const filtered = scoped.filter((d) => (
    typeFilter.includes(d.type) &&
    statusFilter.includes(d.status) &&
    (periodFilter === "all" || getDatasetPeriod(d) === periodFilter) &&
    (!search.trim() || `${d.datasetName} ${d.product}`.toLowerCase().includes(search.toLowerCase()))
  ));

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => {
      const av = getSortValue(a, sort.key);
      const bv = getSortValue(b, sort.key);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [filtered, sort]);

  const { page, pageSize, setPage, setPageSize, slice } = usePagination(sorted.length, 10);
  const paged = slice(sorted);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, search, typeFilter, statusFilter, periodFilter]);

  const scopedResponses = tab === "all" ? responses : responses.filter((r) => getNpsType(r) === tab);
  const openCaseCount = scopedResponses.filter((r) => r.followUpStatus !== "None" && getCasePriorityRank(r) < 4).length;
  const kpis = {
    totalSurveys: scoped.length,
    responses: scoped.reduce((sum, d) => sum + (d.responses || 0), 0),
    needsReview: scoped.filter((d) => d.status === "Needs Review").length,
    followUp: openCaseCount
  };

  const isFiltered = !!search.trim() || typeFilter.length !== TYPE_OPTIONS.length || statusFilter.length !== statusOptions.length || periodFilter !== "all";

  const exportRows = buildDatasetRows(sorted, responses);
  const exportSummary = summarizeDatasetRows(exportRows);
  const exportScopeLabel = isFiltered ? `Filtered view (${sorted.length} of ${datasets.length} surveys)` : `All Surveys (${datasets.length})`;
  const exportGeneratedDate = new Date().toISOString().slice(0, 10);

  const exportOptions = [
    {
      key: "pdf",
      icon: "fileText",
      label: "PDF Report",
      description: "รายงานสรุปพร้อม Analysis และ Insight",
      onSelect: () => { flushSync(() => setPrintMode("table")); window.print(); }
    },
    {
      key: "csv",
      icon: "table",
      label: "CSV Data",
      description: "ข้อมูลดิบสำหรับ Excel หรือระบบอื่น",
      onSelect: () => downloadFile(buildDatasetCsv(exportRows), "survey-datasets.csv", "text/csv")
    },
    {
      key: "md",
      icon: "fileCode",
      label: "Markdown",
      description: "รายงานข้อความสำหรับ Claude, Notion หรือเอกสารภายใน",
      onSelect: () => downloadFile(
        buildDatasetMarkdown({ scopeLabel: exportScopeLabel, generatedDate: exportGeneratedDate, summary: exportSummary, rows: exportRows }),
        "survey-datasets-report.md",
        "text/markdown"
      )
    }
  ];

  const handleExportRow = (dataset, format) => {
    const report = buildDatasetRowReport(dataset, responses, exportGeneratedDate);
    const fileBase = slugifyFileName(dataset.datasetName);
    if (format === "csv") {
      downloadFile(buildRowReportCsv(report), `${fileBase}-responses.csv`, "text/csv");
    } else if (format === "md") {
      downloadFile(buildRowReportMarkdown(report), `${fileBase}-report.md`, "text/markdown");
    } else if (format === "pdf") {
      flushSync(() => { setPrintingRow(report); setPrintMode("row"); });
      window.print();
    }
  };

  return (
    <div>
      <UnderlineTabs tabs={tabs} active={tab} onChange={setTab} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
        <MetricCard label="Total Surveys" value={kpis.totalSurveys} caption="Across all survey types" />
        <MetricCard label="Responses" value={kpis.responses} caption="Collected across all surveys" />
        <MetricCard label="Needs Review" value={kpis.needsReview} caption="Datasets with flagged rows" tone={kpis.needsReview > 0 ? "warning" : "good"} />
        <MetricCard label="Follow-up" value={kpis.followUp} caption="Detractor cases open" tone={kpis.followUp > 0 ? "danger" : "good"} />
      </div>

      <h2 className="text-base font-bold mb-3">Survey Datasets</h2>

      <div className="rounded-[16px] border border-line bg-surface shadow-[0_10px_25px_rgba(16,24,40,0.06)] overflow-hidden">
        <div className="p-4">
          <DatasetToolbar
            search={search}
            onSearch={setSearch}
            count={filtered.length}
            onReset={resetFilters}
            isFiltered={isFiltered}
            onAddSurvey={() => setModalOpen(true)}
            exportOptions={exportOptions}
            periodOptions={periodOptions}
            periodFilter={periodFilter}
            onPeriodFilter={setPeriodFilter}
          />
        </div>

        <div className="border-t border-line">
          <DatasetTable
            datasets={paged}
            responses={responses}
            sort={sort}
            onSort={onSort}
            typeOptions={TYPE_OPTIONS}
            typeFilter={typeFilter}
            onTypeFilter={setTypeFilter}
            statusOptions={statusOptions}
            statusFilter={statusFilter}
            onStatusFilter={setStatusFilter}
            onView={setViewing}
            onDelete={(d) => { removeDataset(d.id); setToast("Deleted"); }}
            onExportRow={handleExportRow}
          />
        </div>

        <Pagination page={page} pageSize={pageSize} total={sorted.length} onPage={setPage} onPageSize={setPageSize} />
      </div>

      <AddDatasetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => { setModalOpen(false); setToast("Survey saved successfully"); }}
      />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.datasetName || "Survey"} maxWidth="max-w-4xl">
        {viewing && (
          <div>
            <div className="rounded-input border border-line overflow-hidden mb-5">
              <EventReportContent report={buildDatasetRowReport(viewing, responses, exportGeneratedDate)} />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setViewing(null)} className="btn-secondary">Close</button>
              <button onClick={() => handleExportRow(viewing, "pdf")} className="btn-primary">⬇ Download PDF</button>
            </div>
          </div>
        )}
      </Modal>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-input bg-ink text-white text-sm font-semibold px-4 py-3 shadow-[0_10px_25px_rgba(16,24,40,0.2)]">
          {toast}
        </div>
      )}

      {printMode === "table" && (
        <DatasetExportReport
          scopeLabel={exportScopeLabel}
          generatedDate={exportGeneratedDate}
          summary={exportSummary}
          rows={exportRows}
        />
      )}
      {printMode === "row" && <DatasetRowExportReport report={printingRow} />}
    </div>
  );
}
