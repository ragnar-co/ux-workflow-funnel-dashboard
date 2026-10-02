import { useMemo, useState } from "react";
import { summarizeResponses, rescale1to5To10, rescale0to5To10, getNpsCategory } from "../../domain/nps.js";
import { getCsatScore } from "../../domain/surveys.js";
import { applyAddNpsMapping, classifyRowStatus, markDuplicateFlags } from "../../domain/importPipeline.js";
import { SearchInput } from "../../components/SearchInput.jsx";
import { FilterSelect } from "../../components/FilterSelect.jsx";
import { NpsInsightCard, ResponseSummaryCard } from "../../components/NpsInsightCard.jsx";
import { ToolbarIcon } from "../../components/ToolbarIcon.jsx";
import { CategoryPill } from "../../components/StatusPill.jsx";

const STATUS_STYLE = {
  "Ready": "bg-brand-green-soft text-brand-green",
  "Needs Review": "bg-brand-amber-soft text-brand-amber",
  "Invalid": "bg-ragnar-red-soft text-ragnar-red",
  "Excluded": "bg-workspace text-muted"
};

function buildRows(parsed, mapping, scoreScale) {
  const mapped = applyAddNpsMapping(parsed.rows, mapping);
  if (scoreScale === "1-5" || scoreScale === "0-5") {
    const rescale = scoreScale === "1-5" ? rescale1to5To10 : rescale0to5To10;
    mapped.forEach((row) => {
      const raw = Number(row.nps_score);
      if (!Number.isNaN(raw) && row.nps_score !== "") row.nps_score = String(rescale(raw));
    });
  }
  const dupFlags = markDuplicateFlags(mapped);
  return mapped.map((row, index) => {
    const status = classifyRowStatus(row);
    const isDuplicate = dupFlags[index];
    return {
      id: `row-${index}`,
      ...row,
      status,
      flags: isDuplicate ? ["duplicate"] : [],
      excluded: status !== "Ready" || isDuplicate,
      editing: false
    };
  });
}

function maskCustomerName(name) {
  const str = String(name || "").trim();
  return str ? `${str.slice(0, 3)}XXX` : str;
}

function formatDateOnly(value) {
  return String(value || "").split("T")[0];
}

function rowNpsCategory(row) {
  const score = Number(row.nps_score);
  if (row.nps_score === "" || row.nps_score == null || Number.isNaN(score)) return null;
  return getNpsCategory(score);
}

export function DatasetReviewStep({ surveyType, parsed, mapping, scoreScale, initialRows, onBack, onContinue }) {
  const isEvent = surveyType === "event";
  const [rows, setRows] = useState(() => initialRows || buildRows(parsed, mapping, scoreScale));
  const [groupFilter, setGroupFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [onlyFlagged, setOnlyFlagged] = useState(false);

  const updateRow = (id, patch) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const readyCount = rows.filter((r) => r.status === "Ready" && !r.excluded).length;
  const needsReviewCount = rows.filter((r) => r.status !== "Ready" || r.flags.includes("duplicate")).length;
  const missingScoreCount = rows.filter((r) => r.status === "Needs Review" && !r.nps_score).length;
  const invalidScoreCount = rows.filter((r) => r.status === "Invalid").length;
  const duplicateCount = rows.filter((r) => r.flags.includes("duplicate")).length;

  const readyScored = rows.filter((r) => r.status === "Ready" && !r.excluded).map((r) => ({ score: Number(r.nps_score) }));
  const npsSummary = summarizeResponses(readyScored);
  const avgScore = readyScored.length ? readyScored.reduce((sum, r) => sum + r.score, 0) / readyScored.length : 0;

  const filtered = useMemo(() => {
    let list = rows;
    if (onlyFlagged) list = list.filter((r) => r.status !== "Ready" || r.flags.includes("duplicate"));
    if (groupFilter !== "all") list = list.filter((r) => rowNpsCategory(r) === groupFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => `${r.customer_name} ${r.comment}`.toLowerCase().includes(q));
    }
    return list;
  }, [rows, groupFilter, onlyFlagged, search]);

  return (
    <div>
      <h3 className="text-sm font-bold mb-1">Validate & Analyze</h3>
      <p className="text-xs text-muted mb-4">{parsed?.rows.length ?? rows.length} responses found</p>

      <NpsInsightCard summary={npsSummary} />

      {npsSummary.total > 0 && (
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-input border border-line bg-surface px-4 py-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-1">CSAT</p>
            <strong className="text-lg">{getCsatScore(readyScored)}%</strong>
            <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
              คะแนนความพึงพอใจเฉลี่ย {avgScore.toFixed(1)} จาก 10 จากทั้งหมด {npsSummary.total} คำตอบ
            </p>
          </div>
          <ResponseSummaryCard summary={npsSummary} />
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-sm text-brand-green">{readyCount} Ready</span>
        {needsReviewCount > 0 && <span className="font-bold text-sm text-brand-amber">{needsReviewCount} Need Review</span>}
      </div>

      {needsReviewCount > 0 && (
        <div className="rounded-input bg-brand-amber-soft/40 border border-brand-amber/30 px-3 py-2 mb-4 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-muted">
            {missingScoreCount} missing score · {invalidScoreCount} invalid score · {duplicateCount} possible duplicates
          </p>
          <button onClick={() => setOnlyFlagged(true)} className="text-xs font-bold text-brand-blue hover:underline whitespace-nowrap">
            Review issues
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search responses..." className="max-w-xs" />
        <FilterSelect
          icon="status"
          value={groupFilter}
          onChange={(value) => {
            setGroupFilter(value);
            setOnlyFlagged(false);
          }}
          options={[
            { value: "all", label: "All groups" },
            { value: "promoter", label: `Promoters (${npsSummary.promoters})` },
            { value: "passive", label: `Passives (${npsSummary.passives})` },
            { value: "detractor", label: `Detractors (${npsSummary.detractors})` }
          ]}
        />
      </div>

      <div className="overflow-x-auto rounded-input border border-line max-h-72 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-workspace text-left text-xs uppercase text-muted sticky top-0">
            <tr>
              <th className="px-3 py-2">{isEvent ? "Company" : "Customer"}</th>
              {!isEvent && <th className="px-3 py-2">Owner</th>}
              <th className="px-3 py-2">Score</th>
              <th className="px-3 py-2">NPS Group</th>
              <th className="px-3 py-2">Comment</th>
              <th className="px-3 py-2">Date</th>
              {!isEvent && <th className="px-3 py-2">Status</th>}
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <ReviewRow key={row.id} row={row} isEvent={isEvent} onUpdate={(patch) => updateRow(row.id, patch)} />
            ))}
            {filtered.length === 0 && <tr><td colSpan={isEvent ? 6 : 8} className="px-3 py-6 text-center text-muted">No responses match this filter.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button onClick={onBack} className="btn-secondary">← Back</button>
        <button onClick={() => onContinue(rows)} className="btn-primary ml-auto">Save Survey</button>
      </div>
    </div>
  );
}

function ReviewRow({ row, isEvent, onUpdate }) {
  const displayStatus = row.status === "Ready" && row.excluded ? "Excluded" : row.status;
  const isDuplicate = row.flags.includes("duplicate");

  if (row.editing) {
    return (
      <tr className="border-t border-line bg-workspace">
        <td className="px-2 py-2"><input value={row.customer_name} onChange={(e) => onUpdate({ customer_name: e.target.value })} className="input" /></td>
        {!isEvent && <td className="px-2 py-2"><input value={row.team_name || ""} onChange={(e) => onUpdate({ team_name: e.target.value })} className="input" /></td>}
        <td className="px-2 py-2"><input value={row.nps_score} onChange={(e) => onUpdate({ nps_score: e.target.value })} className="input w-16" /></td>
        <td className="px-3 py-2">{rowNpsCategory(row) ? <CategoryPill category={rowNpsCategory(row)} /> : <span className="text-muted">—</span>}</td>
        <td className="px-2 py-2"><input value={row.comment} onChange={(e) => onUpdate({ comment: e.target.value })} className="input" /></td>
        <td className="px-2 py-2"><input type="date" value={formatDateOnly(row.submitted_at)} onChange={(e) => onUpdate({ submitted_at: e.target.value })} className="input" /></td>
        {!isEvent && <td className="px-3 py-2 text-xs text-muted">{displayStatus}</td>}
        <td className="px-3 py-2 text-center">
          <button onClick={() => onUpdate({ editing: false, status: classifyRowStatus({ customer_name: row.customer_name, nps_score: row.nps_score, submitted_at: row.submitted_at }) })} className="text-xs font-bold text-brand-blue hover:underline">
            Done
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-t border-line">
      <td className="px-3 py-2 max-w-[120px] truncate">{row.customer_name ? (isEvent ? row.customer_name : maskCustomerName(row.customer_name)) : <span className="text-ragnar-red">—</span>}{isDuplicate && <span className="ml-1 text-xs text-brand-amber">(dup)</span>}</td>
      {!isEvent && <td className="px-3 py-2 max-w-[120px] truncate">{row.team_name || <span className="text-muted">—</span>}</td>}
      <td className="px-3 py-2">{row.nps_score || <span className="text-muted">—</span>}</td>
      <td className="px-3 py-2">{rowNpsCategory(row) ? <CategoryPill category={rowNpsCategory(row)} /> : <span className="text-muted">—</span>}</td>
      <td className="px-3 py-2 max-w-[200px] truncate">{row.comment || <span className="text-muted">—</span>}</td>
      <td className="px-3 py-2 whitespace-nowrap">{row.submitted_at ? formatDateOnly(row.submitted_at) : <span className="text-ragnar-red">—</span>}</td>
      {!isEvent && <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_STYLE[displayStatus] || "bg-workspace text-muted"}`}>{displayStatus}</span></td>}
      <td className="px-3 py-2 text-center">
        <div className="flex items-center justify-center gap-2 whitespace-nowrap">
          <button onClick={() => onUpdate({ editing: true })} title="Edit" className="text-ink hover:opacity-70">
            <ToolbarIcon id="edit" className="h-4 w-4" />
          </button>
          {row.excluded && (
            <button onClick={() => onUpdate({ excluded: false })} className="text-xs font-bold text-brand-green hover:underline">Include</button>
          )}
        </div>
      </td>
    </tr>
  );
}
