import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppState } from "../store/AppStateContext.jsx";
import {
  getNpsCategory, getNpsScore, getNpsType, groupBy, summarizeResponses, signed,
  compareQuarterTags, topRootCauses, getCasePriorityRank, getQuarterTag, getMonthTag
} from "../domain/nps.js";
import { Card } from "../components/Card.jsx";
import { MetricCard } from "../components/MetricCard.jsx";
import { UnderlineTabs } from "../components/UnderlineTabs.jsx";
import { FilterSelect } from "../components/FilterSelect.jsx";
import { getCsatScore, getDatasetPeriod, getSurveyTypeLabel } from "../domain/surveys.js";
import { DatasetStatusChip, CategoryPill } from "../components/StatusPill.jsx";
import { NpsInsightCard, getNpsLevel, buildNpsInsight } from "../components/NpsInsightCard.jsx";
import { buildResponseRows, buildCsv, buildMarkdownReport } from "../domain/eventReport.js";
import { downloadFile, slugifyFileName } from "../domain/exportUtils.js";

function toFilterOptions(values, allLabel) {
  return [{ value: "all", label: `All ${allLabel}` }, ...values.map((v) => ({ value: v, label: v }))];
}

const VIEWS = [
  { id: "overview", label: "Overview" },
  { id: "satisfaction", label: "Customer Satisfaction" },
  { id: "event", label: "Event Feedback" }
];

const EMPTY_FILTERS = { quarter: "all", product: "all", team: "all", owner: "all", eventFilter: "all" };

export function Dashboard() {
  const navigate = useNavigate();
  const { responses, products, events, datasets } = useAppState();
  const [view, setView] = useState("overview");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { quarter, product, team, owner, eventFilter } = filters;
  const setFilter = (key) => (value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const enriched = useMemo(() => responses.map((r) => ({ ...r, quarterTag: r.quarterTag || getQuarterTag(r.date) })), [responses]);
  const scoped = useMemo(() => (view === "overview" ? enriched : enriched.filter((r) => getNpsType(r) === view)), [enriched, view]);

  const quarters = useMemo(
    () => [...new Set(scoped.map((r) => r.quarterTag).filter(Boolean))].sort(compareQuarterTags),
    [scoped]
  );
  const teams = useMemo(() => [...new Set(scoped.map((r) => r.team).filter(Boolean))].sort(), [scoped]);
  const owners = useMemo(() => [...new Set(scoped.map((r) => r.responsible).filter(Boolean))].sort(), [scoped]);

  const filtered = useMemo(() => scoped.filter((r) =>
    (quarter === "all" || r.quarterTag === quarter) &&
    (product === "all" || r.product === product) &&
    (view !== "satisfaction" || team === "all" || r.team === team) &&
    (view !== "satisfaction" || owner === "all" || r.responsible === owner) &&
    (view !== "event" || eventFilter === "all" || r.eventTag === eventFilter)
  ), [scoped, quarter, product, team, owner, view, eventFilter]);

  const openCaseCount = enriched.filter((r) => r.followUpStatus !== "None" && getCasePriorityRank(r) < 4).length;

  return (
    <div>
      <UnderlineTabs
        tabs={VIEWS}
        active={view}
        onChange={(id) => { setView(id); setSelectedEvent(null); setFilters(EMPTY_FILTERS); }}
      />

      {view !== "overview" && (
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <FilterSelect icon="calendar" value={quarter} onChange={setFilter("quarter")} options={toFilterOptions(quarters, "Quarters")} />
          {view === "event" && (
            <FilterSelect
              icon="calendar"
              value={eventFilter}
              onChange={setFilter("eventFilter")}
              options={toFilterOptions([...new Set(scoped.map((r) => r.eventTag).filter(Boolean))], "Events")}
            />
          )}
          <FilterSelect icon="product" value={product} onChange={setFilter("product")} options={toFilterOptions(products.map((p) => p.name), "Products")} />
          {view === "satisfaction" && (
            <>
              <FilterSelect icon="team" value={team} onChange={setFilter("team")} options={toFilterOptions(teams, "Teams")} />
              <FilterSelect icon="owner" value={owner} onChange={setFilter("owner")} options={toFilterOptions(owners, "Owners")} />
            </>
          )}
          <button onClick={() => setFilters(EMPTY_FILTERS)} className="text-xs font-bold text-brand-blue hover:underline ml-auto">
            Reset filters
          </button>
        </div>
      )}

      {view === "overview" && <OverviewView datasets={datasets} responses={enriched} openCaseCount={openCaseCount} />}
      {view === "satisfaction" && <SatisfactionView filtered={filtered} quarters={quarters} products={products} />}
      {view === "event" && (selectedEvent
        ? <EventDetail eventTag={selectedEvent} responses={scoped.filter((r) => r.eventTag === selectedEvent)} events={events} onBack={() => setSelectedEvent(null)} />
        : <EventView filtered={filtered} onSelectEvent={setSelectedEvent} />)}

      {openCaseCount > 0 && (
        <button
          onClick={() => navigate("/response-center")}
          className="mt-5 flex w-full items-center justify-between rounded-input border border-line bg-surface px-4 py-3 text-sm hover:bg-workspace"
        >
          <span><strong className="text-ragnar-red">{openCaseCount}</strong> detractor case(s) need follow-up</span>
          <span className="font-bold text-brand-blue">Go to Response Center →</span>
        </button>
      )}
    </div>
  );
}

function OverviewView({ datasets, responses, openCaseCount }) {
  const summary = summarizeResponses(responses);
  const csat = getCsatScore(responses);
  const recent = [...datasets].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, 5);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <MetricCard label="Total Surveys" value={datasets.length} caption="Across all survey types" />
        <MetricCard label="Total Responses" value={summary.total} caption="All collected responses" />
        <MetricCard label="Avg NPS / CSAT" value={`${signed(summary.nps)} / ${csat}%`} caption="Blended across all surveys" />
        <MetricCard label="Follow-up Needed" value={openCaseCount} caption="Detractor cases open" tone={openCaseCount > 0 ? "danger" : "good"} />
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold">Recent Surveys</h2>
          <Link to="/add-result" className="text-sm font-bold text-brand-blue hover:underline">Go to Survey Management →</Link>
        </div>
        {recent.length === 0 && <p className="text-sm text-muted">No surveys yet.</p>}
        <div className="grid gap-2">
          {recent.map((d) => (
            <div key={d.id} className="grid grid-cols-[1fr_120px_100px_90px] items-center gap-3 rounded-input border border-line px-4 py-3">
              <span>
                <strong className="block text-sm truncate">{d.datasetName}</strong>
                <small className="text-muted">{getSurveyTypeLabel(d.type)} · {getDatasetPeriod(d)}</small>
              </span>
              <span className="text-sm text-muted text-right">{d.responses} responses</span>
              <span className="justify-self-end"><DatasetStatusChip status={d.status} /></span>
              <span className="text-xs text-muted text-right whitespace-nowrap">{d.updatedAt}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SatisfactionView({ filtered, quarters }) {
  const summary = summarizeResponses(filtered);

  const trend = quarters.map((q) => ({ quarter: q, nps: getNpsScore(filtered.filter((r) => r.quarterTag === q)) }));
  const lastTwo = trend.slice(-2);
  const delta = lastTwo.length === 2 ? lastTwo[1].nps - lastTwo[0].nps : null;

  const productPerf = Object.entries(groupBy(filtered, "product"))
    .map(([name, items]) => ({ name, nps: getNpsScore(items), count: items.length }))
    .sort((a, b) => b.nps - a.nps);

  const topics = topRootCauses(filtered, 6);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <MetricCard
          label="NPS Score"
          value={signed(summary.nps)}
          caption={delta == null ? "No prior quarter to compare" : `${delta >= 0 ? "↑" : "↓"} ${Math.abs(delta)} vs previous quarter`}
          tone={summary.nps < 30 ? "danger" : "good"}
        />
        <MetricCard label="Responses" value={summary.total} caption={`${summary.promoterRate}% promoter · ${summary.passiveRate}% passive · ${summary.detractorRate}% detractor`} />
        <MetricCard label="Detractor Rate" value={`${summary.detractorRate}%`} caption={`${summary.detractors} response(s)`} tone={summary.detractorRate > 20 ? "danger" : "good"} />
      </div>

      <Card className="p-5 mb-4">
        <h2 className="text-base font-bold mb-3">NPS Trend by Quarter</h2>
        {trend.length === 0 && <p className="text-sm text-muted">No quarterly data yet.</p>}
        <div className="grid gap-2">
          {trend.map(({ quarter, nps }) => (
            <div key={quarter} className="grid grid-cols-[100px_1fr_50px] items-center gap-3">
              <span className="text-sm font-semibold text-muted">{quarter}</span>
              <span className="block h-3 overflow-hidden rounded bg-[#f1f5fa]">
                <i className="block h-full rounded bg-brand-blue" style={{ width: `${Math.max(4, Math.min(100, nps + 50))}%` }} />
              </span>
              <strong className="text-sm text-right">{signed(nps)}</strong>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 mb-4">
        <h2 className="text-base font-bold mb-3">Product Performance</h2>
        {productPerf.length === 0 && <p className="text-sm text-muted">No data from current filters.</p>}
        <div className="grid gap-2">
          {productPerf.map(({ name, nps, count }) => (
            <div key={name} className="grid grid-cols-[1fr_120px_50px] items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-workspace">
              <span><strong className="text-sm">{name}</strong> <small className="text-muted">{count} responses</small></span>
              <span className="block h-3 overflow-hidden rounded bg-[#f1f5fa]">
                <i className="block h-full rounded bg-brand-green" style={{ width: `${Math.max(4, Math.min(100, nps + 50))}%` }} />
              </span>
              <strong className="text-sm text-right">{signed(nps)}</strong>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-bold mb-3">Feedback Insights</h2>
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-2">Top Topics</p>
        {topics.length === 0 && <p className="text-sm text-muted">No feedback themes yet.</p>}
        <div className="grid gap-1.5">
          {topics.map((t) => (
            <div key={t.label} className="flex items-center justify-between text-sm">
              <span className="font-semibold">{t.label}</span>
              <span className="text-muted">{t.count}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function EventView({ filtered, onSelectEvent }) {
  const summary = summarizeResponses(filtered);
  const groups = groupBy(filtered, "eventTag");
  const eventList = Object.entries(groups)
    .filter(([name]) => name !== "Unassigned")
    .map(([name, items]) => ({ name, items, nps: getNpsScore(items), count: items.length }))
    .sort((a, b) => b.nps - a.nps);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <MetricCard label="Event NPS" value={signed(summary.nps)} caption="Across selected events" tone={summary.nps < 30 ? "danger" : "good"} />
        <MetricCard label="Responses" value={summary.total} caption={`${summary.promoterRate}% promoter · ${summary.detractorRate}% detractor`} />
        <MetricCard label="Events" value={eventList.length} caption="Distinct events in view" />
      </div>

      <Card className="p-5">
        <h2 className="text-base font-bold mb-3">Event Performance</h2>
        {eventList.length === 0 && <p className="text-sm text-muted">No event NPS responses yet.</p>}
        <div className="grid gap-2">
          {eventList.map((e) => (
            <button
              key={e.name}
              onClick={() => onSelectEvent(e.name)}
              className="grid grid-cols-[1fr_80px_20px] items-center gap-3 rounded-input border border-line px-4 py-3 text-left hover:bg-workspace"
            >
              <span>
                <strong className="block text-sm">{e.name}</strong>
                <small className="text-muted">{e.count} responses</small>
              </span>
              <strong className={`text-sm text-right ${e.nps < 30 ? "text-ragnar-red" : "text-brand-green"}`}>{signed(e.nps)}</strong>
              <span className="text-muted text-right">→</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function EventDetail({ eventTag, responses, events, onBack }) {
  const summary = summarizeResponses(responses);
  const info = events.find((e) => e.name === eventTag);
  const positive = topRootCauses(responses.filter((r) => getNpsCategory(r.score) === "promoter"), 3);
  const improvement = topRootCauses(responses.filter((r) => getNpsCategory(r.score) !== "promoter"), 3);

  const level = getNpsLevel(summary.nps);
  const { insight, action } = buildNpsInsight({ ...summary, levelTone: level.tone });
  const period = info?.date ? getMonthTag(info.date) : "—";
  const products = info?.product || "—";
  const rows = buildResponseRows(responses);
  const fileBase = slugifyFileName(eventTag);
  const reportData = { eventName: eventTag, period, products, summary, level, insight, action, rows };

  const handleExportPdf = () => window.print();
  const handleExportCsv = () => downloadFile(buildCsv(rows), `${fileBase}-responses.csv`, "text/csv");
  const handleExportMarkdown = () => downloadFile(buildMarkdownReport(reportData), `${fileBase}-report.md`, "text/markdown");

  return (
    <div>
      <button onClick={onBack} className="text-sm font-bold text-brand-blue hover:underline mb-3 no-print">← Back to Events</button>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 no-print">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted">Export</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportPdf} className="btn-outline-sm">📄 PDF Summary Report</button>
          <button onClick={handleExportCsv} className="btn-outline-sm">📊 CSV Table Data</button>
          <button onClick={handleExportMarkdown} className="btn-outline-sm">📝 Markdown Report (.md)</button>
        </div>
      </div>

      <div className="print-report">
        <Card className="p-5 mb-4">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-1">Event Feedback Report</p>
          <h2 className="text-lg font-bold mb-2">{eventTag}</h2>
          <div className="grid sm:grid-cols-2 gap-1 text-sm text-muted">
            <p><span className="font-semibold text-ink">Period:</span> {period}</p>
            <p><span className="font-semibold text-ink">Products:</span> {products}</p>
          </div>
        </Card>

        <NpsInsightCard summary={summary} />

        <Card className="p-5 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-2">Top Positive Feedback</p>
              {positive.length === 0 && <p className="text-sm text-muted">No promoter themes yet.</p>}
              <div className="grid gap-1">
                {positive.map((t) => <div key={t.label} className="text-sm">• {t.label}</div>)}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-2">Top Improvement</p>
              {improvement.length === 0 && <p className="text-sm text-muted">No improvement themes yet.</p>}
              <div className="grid gap-1">
                {improvement.map((t) => <div key={t.label} className="text-sm">• {t.label}</div>)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-bold mb-3">Response Table</h2>
          <div className="overflow-x-auto rounded-input border border-line">
            <table className="w-full text-sm">
              <thead className="bg-workspace text-left text-xs uppercase text-muted">
                <tr>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Score</th>
                  <th className="px-3 py-2">Comment</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 max-w-[140px] truncate">{r.customer}</td>
                    <td className="px-3 py-2">{r.score}</td>
                    <td className="px-3 py-2 max-w-[260px] truncate">{r.comment || <span className="text-muted">—</span>}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{r.date}</td>
                    <td className="px-3 py-2"><CategoryPill category={r.status.toLowerCase()} /></td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={5} className="px-3 py-6 text-center text-muted">No responses yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
