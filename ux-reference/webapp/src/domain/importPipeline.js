import Papa from "papaparse";
import { getNpsCategory, getMonthTag, suggestRootCause, suggestPriority, extractThemes } from "./nps.js";

function normalize(text) {
  return String(text || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
}

function normalizeDate(raw) {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDelimitedText(text) {
  const result = Papa.parse(text.trim(), { skipEmptyLines: true });
  const [header, ...rows] = result.data;
  return {
    headers: header || [],
    rows: rows.map((cells) => header.reduce((acc, key, index) => {
      acc[key] = cells[index] ?? "";
      return acc;
    }, {}))
  };
}

export const ADD_NPS_FIELDS = [
  { key: "customer_name", label: "Customer Name" },
  { key: "nps_score", label: "NPS Score" },
  { key: "comment", label: "Feedback Text" },
  { key: "nps_reason", label: "NPS Reason" },
  { key: "q_speaker", label: "Speaker / Content Quality" },
  { key: "q_logistics", label: "Date, Time & Venue" },
  { key: "q_usefulness", label: "Content Usefulness" },
  { key: "submitted_at", label: "Date" },
  { key: "product_name", label: "Product" },
  { key: "team_name", label: "Team / Owner" },
  { key: "tags", label: "Tags" }
];

const EVENT_CUSTOMER_HINTS = ["องค์กร", "บริษัท", "company", "organization", "organisation"];

const ADD_NPS_HINTS = {
  customer_name: ["customer", "name", "respondent", "ชื่อ"],
  nps_score: ["score", "nps", "rating", "คะแนน", "แนะนำ", "แนวโน้ม", "recommend"],
  comment: ["comment", "feedback", "ความคิดเห็น", "ข้อเสนอแนะ", "suggestion"],
  nps_reason: ["เพราะเหตุใด", "เหตุผล", "reason", "why"],
  q_speaker: ["ผู้บรรยาย", "speaker", "presentation", "นำเสนอ"],
  q_logistics: ["วัน เวลา", "สถานที่", "venue", "logistics"],
  q_usefulness: ["ประโยชน์", "usefulness", "benefit"],
  submitted_at: ["date", "submitted", "responsedate", "วันที่"],
  product_name: ["product", "โปรดักซ์"],
  team_name: ["team", "owner", "responsible", "ทีม"],
  tags: ["tag", "topic", "แท็ก"]
};

export function suggestAddNpsMapping(headers, surveyType) {
  const mapping = {};
  ADD_NPS_FIELDS.forEach(({ key }) => {
    const useEventHints = key === "customer_name" && surveyType === "event";
    const hints = (useEventHints ? EVENT_CUSTOMER_HINTS : (ADD_NPS_HINTS[key] || [])).map(normalize);
    const found = headers.find((header) => hints.some((hint) => normalize(header).includes(hint)));
    mapping[key] = found || "";
  });
  return mapping;
}

export function applyAddNpsMapping(rawRows, mapping) {
  return rawRows.map((raw) => {
    const mapped = {};
    ADD_NPS_FIELDS.forEach(({ key }) => {
      const sourceColumn = mapping[key];
      mapped[key] = sourceColumn ? String(raw[sourceColumn] ?? "").trim() : "";
    });
    return mapped;
  });
}

export function classifyRowStatus(row) {
  if (!row.customer_name || !row.submitted_at || Number.isNaN(new Date(row.submitted_at).getTime())) return "Needs Review";
  if (!row.nps_score) return "Needs Review";
  const score = Number(row.nps_score);
  if (Number.isNaN(score)) return "Needs Review";
  if (score < 0 || score > 10) return "Invalid";
  return "Ready";
}

export function markDuplicateFlags(rows) {
  const seen = new Set();
  return rows.map((row) => {
    const key = `${normalize(row.customer_name)}|${normalize(row.submitted_at)}|${normalize(row.team_name)}`;
    const isDup = key.replace(/\|/g, "").trim() !== "" && seen.has(key);
    seen.add(key);
    return isDup;
  });
}

export function buildAddNpsDraftResults(rows, { quarterTag, product, npsType, surveyPeriod, eventName, eventDate, datasetId }) {
  return rows.filter((row) => !row.excluded).map((row) => {
    const score = Number(row.nps_score);
    const date = normalizeDate(row.submitted_at);
    const category = getNpsCategory(score);
    const tags = String(row.tags || "").split(/[,;]/).map((t) => t.trim()).filter(Boolean);
    const subScores = {
      q_speaker: row.q_speaker,
      q_logistics: row.q_logistics,
      q_usefulness: row.q_usefulness
    };
    const hasSubScores = Object.values(subScores).some((v) => v !== undefined && v !== "");
    const rootCauseText = row.nps_reason || row.comment;
    return {
      id: crypto.randomUUID(),
      datasetId,
      customer: row.customer_name,
      product,
      team: row.team_name || "",
      responsible: row.team_name || "Unassigned",
      score,
      source: npsType === "event" ? "metasurvey" : "upload",
      date,
      comment: row.comment,
      npsReason: row.nps_reason || null,
      subScores: hasSubScores ? subScores : null,
      rootCause: suggestRootCause(rootCauseText, hasSubScores ? subScores : null),
      themes: tags.length ? tags : extractThemes(rootCauseText),
      followUpStatus: suggestPriority({ score }),
      slaHoursLeft: category === "detractor" ? 48 : null,
      eventTag: npsType === "event" ? eventName : null,
      npsType,
      quarterTag,
      monthTag: getMonthTag(date),
      surveyPeriod: npsType === "satisfaction" ? surveyPeriod : null,
      eventDate: npsType === "event" ? eventDate : null
    };
  });
}
