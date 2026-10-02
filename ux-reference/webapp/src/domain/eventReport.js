import { getNpsCategory, signed } from "./nps.js";
import { csvEscape } from "./exportUtils.js";

const CATEGORY_LABEL = { promoter: "Promoter", passive: "Passive", detractor: "Detractor" };

export function buildResponseRows(responses) {
  return responses.map((r) => ({
    customer: r.customer || "—",
    score: r.score,
    comment: r.comment || "",
    date: r.date || "",
    status: CATEGORY_LABEL[getNpsCategory(r.score)]
  }));
}

export function buildCsv(rows) {
  const header = ["Customer", "Score", "Comment", "Date", "Status"];
  const lines = [
    header.join(","),
    ...rows.map((r) => [r.customer, r.score, r.comment, r.date, r.status].map(csvEscape).join(","))
  ];
  return lines.join("\n");
}

export function buildMarkdownReport({ eventName, period, products, summary, level, insight, action, rows }) {
  const lines = [
    "# Event Feedback Report",
    "",
    `**Event:** ${eventName}`,
    `**Period:** ${period}`,
    `**Products:** ${products}`,
    "",
    "## Key Metrics",
    "",
    `- NPS Score: ${signed(summary.nps)} (${level.label})`,
    `- Responses: ${summary.total}`,
    `- Promoters: ${summary.promoters} (${summary.promoterRate}%)`,
    `- Passives: ${summary.passives} (${summary.passiveRate}%)`,
    `- Detractors: ${summary.detractors} (${summary.detractorRate}%)`,
    "",
    "## Insight",
    "",
    insight,
    "",
    `**Recommended Action:** ${action}`,
    "",
    "## Response Table",
    "",
    "| Customer | Score | Comment | Date | Status |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map((r) => `| ${r.customer} | ${r.score} | ${String(r.comment || "").replace(/\|/g, "/")} | ${r.date} | ${r.status} |`)
  ];
  return lines.join("\n");
}
