import { getDatasetPeriod, getSurveyTypeLabel, getDatasetNpsScore } from "./surveys.js";
import { signed } from "./nps.js";
import { csvEscape } from "./exportUtils.js";

export const NPS_MEANING_TH =
  "คะแนน NPS อยู่ในช่วง -100 ถึง +100 ค่าบวกแปลว่ามี Promoters มากกว่า Detractors และควรใช้ร่วมกับความคิดเห็นเพื่อวางแผน follow-up";

export function buildDatasetRows(datasets, responses) {
  return datasets.map((d) => ({
    survey_name: d.datasetName,
    type: getSurveyTypeLabel(d.type),
    product_event: d.product,
    period: getDatasetPeriod(d),
    responses: d.responses || 0,
    nps_score: getDatasetNpsScore(d, responses),
    status: d.status,
    updated_at: d.updatedAt || ""
  }));
}

export function summarizeDatasetRows(rows) {
  const totalSurveys = rows.length;
  const totalResponses = rows.reduce((sum, r) => sum + (Number(r.responses) || 0), 0);
  const npsValues = rows.map((r) => r.nps_score).filter((v) => v != null);
  const avgNps = npsValues.length ? Math.round(npsValues.reduce((a, b) => a + b, 0) / npsValues.length) : null;
  const readyCount = rows.filter((r) => r.status === "Ready").length;
  const needsReviewCount = rows.filter((r) => r.status === "Needs Review").length;
  return { totalSurveys, totalResponses, avgNps, readyCount, needsReviewCount };
}

const CSV_HEADER = ["survey_name", "type", "product_event", "period", "responses", "nps_score", "status", "updated_at"];

export function buildDatasetCsv(rows) {
  const lines = [
    CSV_HEADER.join(","),
    ...rows.map((r) => CSV_HEADER.map((key) => csvEscape(r[key] ?? "")).join(","))
  ];
  return lines.join("\n");
}

export function buildDatasetMarkdown({ scopeLabel, generatedDate, summary, rows }) {
  const lines = [
    "# Survey Dataset Summary Report",
    "",
    `**Export Scope:** ${scopeLabel}`,
    `**Generated Date:** ${generatedDate}`,
    `**Total Surveys:** ${summary.totalSurveys}`,
    `**Total Responses:** ${summary.totalResponses}`,
    "",
    "## Analysis Summary",
    "",
    `- Total Surveys: ${summary.totalSurveys}`,
    `- Total Responses: ${summary.totalResponses}`,
    `- Average NPS: ${summary.avgNps == null ? "—" : signed(summary.avgNps)}`,
    `- Ready: ${summary.readyCount} · Needs Review: ${summary.needsReviewCount}`,
    "",
    "## Dataset Table",
    "",
    "| Survey Name | Type | Product / Event | Period | Responses | NPS Score | Status | Updated |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows.map((r) => `| ${r.survey_name} | ${r.type} | ${r.product_event} | ${r.period} | ${r.responses} | ${r.nps_score == null ? "—" : signed(r.nps_score)} | ${r.status} | ${r.updated_at} |`),
    "",
    "## NPS Meaning",
    "",
    NPS_MEANING_TH
  ];
  return lines.join("\n");
}
