import appConfig from "../config/app-config.json";
import { getNpsCategory, getNpsScore, getNpsType } from "./nps.js";

const SURVEY_TYPE_BY_ID = Object.fromEntries((appConfig.surveyTypes || []).map((t) => [t.id, t]));

export function getSurveyTypeLabel(type) {
  return SURVEY_TYPE_BY_ID[type]?.shortLabel || SURVEY_TYPE_BY_ID[type]?.label || "Custom";
}

export function getSurveyTypeFullLabel(type) {
  return SURVEY_TYPE_BY_ID[type]?.label || "Custom";
}

export function getDefaultMetrics(type) {
  return SURVEY_TYPE_BY_ID[type]?.defaultMetrics || ["Topics"];
}

export function getDatasetPeriod(dataset) {
  return dataset.period || dataset.quarter || dataset.eventDate || dataset.surveyPeriod || "—";
}

export function getCsatScore(items) {
  if (!items.length) return 0;
  const satisfied = items.filter((item) => getNpsCategory(item.score) !== "detractor").length;
  return Math.round((satisfied / items.length) * 100);
}

export function getDatasetNpsScore(dataset, responses) {
  if (!getDefaultMetrics(dataset.type).includes("NPS")) return null;
  const exact = responses.filter((r) => r.datasetId && r.datasetId === dataset.id);
  const matches = exact.length ? exact : responses.filter((r) => r.product === dataset.product && getNpsType(r) === dataset.type);
  if (!matches.length) return null;
  return getNpsScore(matches);
}
