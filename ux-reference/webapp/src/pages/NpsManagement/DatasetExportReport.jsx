import { Fragment } from "react";
import { signed } from "../../domain/nps.js";
import { NPS_MEANING_TH } from "../../domain/datasetReport.js";

const TONE_STYLE = {
  blue: { box: "bg-brand-blue-soft border-brand-blue/15", label: "text-brand-blue" },
  green: { box: "bg-brand-green-soft border-brand-green/15", label: "text-brand-green" },
  amber: { box: "bg-brand-amber-soft border-brand-amber/15", label: "text-brand-amber" },
  neutral: { box: "bg-workspace border-line", label: "text-muted" }
};

function Section({ title, children }) {
  return (
    <section className="mb-5">
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
    <div className={`flex-1 min-w-[120px] rounded-md border px-3 py-2 ${t.box}`}>
      <p className={`text-[10px] font-bold uppercase tracking-wide ${t.label}`}>{label}</p>
      <p className="text-base font-bold text-ink mt-0.5">{value}</p>
    </div>
  );
}

export function DatasetExportReport({ scopeLabel, generatedDate, summary, rows }) {
  return (
    <div className="hidden print:block print-report bg-white text-ink" style={{ padding: "0 32px 32px" }}>
      <div style={{ height: 4, background: "#2F80ED", margin: "0 -32px 24px" }} />

      <header className="mb-6 pb-3" style={{ borderBottom: "1px solid #e8e8e8" }}>
        <h1 className="text-lg font-bold text-[#1F2937]">Survey Dataset Summary Report</h1>
        <p className="text-xs text-[#64748B] mt-0.5">Generated: {generatedDate}</p>
      </header>

      <Section title="Export Overview">
        <DL items={[
          ["Export Scope", scopeLabel],
          ["Generated Date", generatedDate],
          ["Total Surveys", summary.totalSurveys],
          ["Total Responses", summary.totalResponses]
        ]} />
      </Section>

      <Section title="Analysis Summary">
        <div className="flex flex-wrap gap-2">
          <StatTile label="Total Surveys" value={summary.totalSurveys} tone="blue" />
          <StatTile label="Total Responses" value={summary.totalResponses} tone="neutral" />
          <StatTile label="Average NPS" value={summary.avgNps == null ? "—" : signed(summary.avgNps)} tone="green" />
          <StatTile label="Ready / Needs Review" value={`${summary.readyCount} / ${summary.needsReviewCount}`} tone="amber" />
        </div>
      </Section>

      <Section title="NPS Meaning">
        <div className="rounded-r-md bg-brand-blue-soft/50 px-4 py-3" style={{ borderLeft: "3px solid #2F80ED" }}>
          <p className="text-sm leading-relaxed">{NPS_MEANING_TH}</p>
        </div>
      </Section>

      <Section title="Dataset Appendix">
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr className="bg-workspace text-left text-[11px] uppercase tracking-wide text-[#64748B]">
              <th className="py-2 px-2.5 rounded-l">Survey Name</th>
              <th className="py-2 px-2.5">Type</th>
              <th className="py-2 px-2.5">Product / Event</th>
              <th className="py-2 px-2.5 whitespace-nowrap">Period</th>
              <th className="py-2 px-2.5">Responses</th>
              <th className="py-2 px-2.5">NPS Score</th>
              <th className="py-2 px-2.5">Status</th>
              <th className="py-2 px-2.5 rounded-r whitespace-nowrap">Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f2f2f2" }}>
                <td className="py-1.5 px-2.5 text-[#1F2937]">{r.survey_name}</td>
                <td className="py-1.5 px-2.5 text-[#475569]">{r.type}</td>
                <td className="py-1.5 px-2.5 text-[#475569]">{r.product_event}</td>
                <td className="py-1.5 px-2.5 text-[#475569] whitespace-nowrap">{r.period}</td>
                <td className="py-1.5 px-2.5 text-[#1F2937]">{r.responses}</td>
                <td className={`py-1.5 px-2.5 font-semibold ${r.nps_score != null && r.nps_score < 30 ? "text-ragnar-red" : "text-brand-green"}`}>
                  {r.nps_score == null ? "—" : signed(r.nps_score)}
                </td>
                <td className="py-1.5 px-2.5 text-[#1F2937]">{r.status}</td>
                <td className="py-1.5 px-2.5 text-[#475569] whitespace-nowrap">{r.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}
