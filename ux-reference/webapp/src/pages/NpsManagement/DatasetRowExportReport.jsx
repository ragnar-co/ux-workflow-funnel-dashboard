import { Fragment } from "react";
import { signed } from "../../domain/nps.js";
import { NPS_CALC_TH } from "../../domain/datasetRowReport.js";

const TONE_STYLE = {
  blue: { box: "bg-brand-blue-soft border-brand-blue/15", label: "text-brand-blue" },
  green: { box: "bg-brand-green-soft border-brand-green/15", label: "text-brand-green" },
  amber: { box: "bg-brand-amber-soft border-brand-amber/15", label: "text-brand-amber" },
  red: { box: "bg-ragnar-red-soft border-ragnar-red/15", label: "text-ragnar-red" },
  neutral: { box: "bg-workspace border-line", label: "text-muted" }
};

const NPS_GROUP_STYLE = {
  Promoter: "bg-brand-green-soft text-brand-green",
  Passive: "bg-brand-amber-soft text-brand-amber",
  Detractor: "bg-ragnar-red-soft text-ragnar-red"
};

function Section({ title, children, className = "" }) {
  return (
    <section className={`mb-5 ${className}`}>
      <h2 className="text-xs font-bold uppercase tracking-wide text-[#263445] pb-1.5 mb-2.5" style={{ borderBottom: "1px solid #e8e8e8" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function DL({ items }) {
  return (
    <div className="grid text-sm" style={{ gridTemplateColumns: "auto 1fr" }}>
      {items.map(([label, value]) => (
        <Fragment key={label}>
          <div className="py-1.5 pr-4 text-[#64748B] font-medium border-r whitespace-nowrap" style={{ borderColor: "#e8e8e8", borderBottom: "1px solid #f2f2f2" }}>
            {label}
          </div>
          <div className="py-1.5 pl-4 text-left font-semibold text-[#1F2937]" style={{ borderBottom: "1px solid #f2f2f2" }}>
            {value}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function StatTile({ label, value, tone }) {
  const t = TONE_STYLE[tone] || TONE_STYLE.neutral;
  return (
    <div className={`flex-1 min-w-[110px] rounded-md border px-3 py-2 ${t.box}`}>
      <p className={`text-[10px] font-bold uppercase tracking-wide ${t.label}`}>{label}</p>
      <p className="text-base font-bold text-ink mt-0.5">{value}</p>
    </div>
  );
}

function Callout({ tone, children }) {
  const border = tone === "blue" ? "#2F80ED" : "#45C58A";
  const bg = tone === "blue" ? "bg-brand-blue-soft/50" : "bg-brand-green-soft/50";
  return (
    <div className={`rounded-r-md px-4 py-3 ${bg}`} style={{ borderLeft: `3px solid ${border}` }}>
      {children}
    </div>
  );
}

function NpsGroupBadge({ value }) {
  const style = NPS_GROUP_STYLE[value];
  if (!style) return <span className="text-muted">{value}</span>;
  return <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${style}`}>{value}</span>;
}

function ResponseTable({ rows, statusHeader, isEvent }) {
  const colCount = isEvent ? 4 : 6;
  return (
    <table className="w-full text-sm mb-4" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr className="bg-workspace text-left text-[11px] uppercase tracking-wide text-[#64748B]">
          <th className="py-2 px-2.5 rounded-l">{isEvent ? "Company" : "Customer"}</th>
          {!isEvent && <th className="py-2 px-2.5">Owner</th>}
          <th className="py-2 px-2.5">Score</th>
          <th className="py-2 px-2.5">NPS Group</th>
          <th className={`py-2 px-2.5 ${isEvent ? "rounded-r" : ""}`}>Comment</th>
          {!isEvent && <th className="py-2 px-2.5 rounded-r">{statusHeader}</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{ borderBottom: "1px solid #f2f2f2" }}>
            <td className="py-1.5 px-2.5 text-[#1F2937]">{r.customer}</td>
            {!isEvent && <td className="py-1.5 px-2.5 text-[#475569]">{r.owner}</td>}
            <td className="py-1.5 px-2.5 text-[#1F2937]">{r.score}</td>
            <td className="py-1.5 px-2.5"><NpsGroupBadge value={r.nps_group} /></td>
            <td className="py-1.5 px-2.5 text-[#475569]">{r.comment}</td>
            {!isEvent && <td className="py-1.5 px-2.5 text-[#1F2937]">{r.status}</td>}
          </tr>
        ))}
        {rows.length === 0 && <tr><td colSpan={colCount} className="py-3 text-center text-[#64748B]">No responses.</td></tr>}
      </tbody>
    </table>
  );
}

// The report body — shared verbatim between the on-screen preview (View modal)
// and the print-only PDF export below, so what you preview is exactly what prints.
export function EventReportContent({ report }) {
  if (!report) return null;
  const npsLabel = report.nps == null ? "—" : signed(report.nps);

  return (
    <div className="bg-white text-ink" style={{ padding: "0 32px 32px" }}>
      <div style={{ height: 4, background: "#2F80ED", margin: "0 -32px 24px" }} />

      <header className="mb-6 pb-3" style={{ borderBottom: "1px solid #e8e8e8" }}>
        <h1 className="text-lg font-bold text-[#1F2937]">Event Feedback Report</h1>
        <p className="text-xs text-[#64748B] mt-0.5">Generated: {report.generatedDate}</p>
      </header>

      <Section title="Event Overview">
        <DL items={[
          ["Event Name", report.eventName],
          ["Survey Type", report.surveyType],
          ["Product / Event", report.productEvent],
          ...(report.eventDate ? [["Date", report.eventDate]] : [["Period", report.period]]),
          ["Status", report.status],
          ["Total Responses", report.totalResponses]
        ]} />
      </Section>

      <Section title="Analysis Summary">
        <div className="flex flex-wrap gap-2 mb-3">
          <StatTile label="NPS Score" value={`${npsLabel} · ${report.level.label}`} tone="blue" />
          <StatTile label="Promoters" value={`${report.promoters} (${report.promoterPct}%)`} tone="green" />
          <StatTile label="Passives" value={`${report.passives} (${report.passivePct}%)`} tone="amber" />
          <StatTile label="Detractors" value={`${report.detractors} (${report.detractorPct}%)`} tone="red" />
          {report.csat != null && <StatTile label="CSAT" value={`${report.csat}%`} tone="neutral" />}
        </div>
        <p className="text-sm mt-2"><strong className="text-[#1F2937] font-semibold">Response Summary:</strong> <span className="text-[#475569]">{report.responseSummaryTh}</span></p>
        <p className="text-sm mt-1.5"><strong className="text-[#1F2937] font-semibold">Follow-up Priority:</strong> <span className="text-[#475569]">{report.followUpPriorityTh}</span></p>
      </Section>

      <Section title="NPS Calculation">
        <p className="text-sm leading-relaxed text-[#475569]">{NPS_CALC_TH}</p>
        <p className="inline-block mt-2 rounded-md bg-brand-blue-soft/40 px-3 py-1.5 text-sm font-semibold" style={{ fontFamily: "ui-monospace, monospace" }}>
          Promoters {report.promoterPct}% - Detractors {report.detractorPct}% = NPS {npsLabel}
        </p>
      </Section>

      <Section title="Insight">
        <Callout tone="blue">
          <p className="text-sm leading-relaxed">{report.insightTh}</p>
        </Callout>
      </Section>

      <Section title="Recommended Action">
        <Callout tone="green">
          <p className="text-sm leading-relaxed">{report.actionTh}</p>
        </Callout>
      </Section>

      <Section title="Additional Metrics">
        <DL items={[
          ["Average Score", report.avgScore == null ? "—" : report.avgScore],
          ["Included Responses", report.includedRows.length],
          ["Excluded Responses", report.excludedRows.length]
        ]} />
      </Section>

      <Section title="Response Appendix" className="mb-0">
        <ResponseTable rows={report.includedRows} statusHeader="Status" isEvent={report.isEvent} />

        {report.excludedRows.length > 0 && (
          <>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#64748B] mb-2 mt-4">Excluded Responses</p>
            <ResponseTable rows={report.excludedRows} statusHeader="Reason" isEvent={report.isEvent} />
          </>
        )}
      </Section>
    </div>
  );
}

export function DatasetRowExportReport({ report }) {
  if (!report) return null;
  return (
    <div className="hidden print:block print-report">
      <EventReportContent report={report} />
    </div>
  );
}
