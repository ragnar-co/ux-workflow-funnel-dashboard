const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getNpsCategory(score) {
  if (score >= 9) return "promoter";
  if (score >= 7) return "passive";
  return "detractor";
}

export function rescale1to5To10(value) {
  return Math.round(((value - 1) / 4) * 10);
}

export function rescale0to5To10(value) {
  return Math.round((value / 5) * 10);
}

export function getNpsScore(items) {
  const total = items.length || 1;
  const promoters = items.filter((item) => getNpsCategory(item.score) === "promoter").length;
  const detractors = items.filter((item) => getNpsCategory(item.score) === "detractor").length;
  return Math.round(((promoters - detractors) / total) * 100);
}

export function getNpsLevel(nps) {
  if (nps < 0) return { label: "Risk", tone: "risk" };
  if (nps < 30) return { label: "Neutral", tone: "neutral" };
  if (nps < 70) return { label: "Good", tone: "good" };
  return { label: "Excellent", tone: "excellent" };
}

export function summarizeResponses(items) {
  const total = items.length;
  const promoters = items.filter((item) => getNpsCategory(item.score) === "promoter").length;
  const passives = items.filter((item) => getNpsCategory(item.score) === "passive").length;
  const detractors = items.filter((item) => getNpsCategory(item.score) === "detractor").length;

  return {
    total,
    nps: getNpsScore(items),
    promoters,
    passives,
    detractors,
    promoterRate: Math.round((promoters / (total || 1)) * 100),
    passiveRate: Math.round((passives / (total || 1)) * 100),
    detractorRate: Math.round((detractors / (total || 1)) * 100)
  };
}

export function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "Unassigned";
    acc[value] = acc[value] || [];
    acc[value].push(item);
    return acc;
  }, {});
}

export function getMonthTag(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export function getQuarterTag(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `Q${quarter} ${date.getFullYear()}`;
}

export function getNpsType(item) {
  return item.npsType || (item.eventTag ? "event" : "satisfaction");
}

export function parseQuarterTag(tag) {
  const match = /^Q(\d)\s?(\d{4})$/.exec(tag || "");
  if (!match) return { quarter: 0, year: 0 };
  return { quarter: Number(match[1]), year: Number(match[2]) };
}

export function compareQuarterTags(a, b) {
  const pa = parseQuarterTag(a);
  const pb = parseQuarterTag(b);
  return pa.year - pb.year || pa.quarter - pb.quarter;
}

const ROOT_CAUSE_RULES = [
  { keywords: ["ช้า", "ล่าช้า", "รอ", "นาน"], label: "Response Speed" },
  { keywords: ["ราคา", "แพง", "ค่าใช้จ่าย"], label: "Pricing" },
  { keywords: ["ยาก", "ซับซ้อน", "สับสน", "เข้าใจยาก"], label: "Usability" },
  { keywords: ["บั๊ก", "error", "พัง", "ล่ม"], label: "Product Bug" },
  { keywords: ["ประทับใจ", "ดีมาก", "ชัดเจน", "มืออาชีพ"], label: "Positive Experience" }
];

const SUB_SCORE_LABELS = {
  q_speaker: "Speaker / Content Delivery",
  q_logistics: "Event Logistics (Date, Time, Venue)",
  q_usefulness: "Content Usefulness"
};

export function suggestRootCause(comment = "", subScores = null) {
  if (subScores) {
    const entries = Object.entries(subScores).filter(([, v]) => v != null && v !== "" && !Number.isNaN(Number(v)));
    if (entries.length) {
      const [worstKey, worstValue] = entries.reduce((worst, entry) => (Number(entry[1]) < Number(worst[1]) ? entry : worst));
      if (Number(worstValue) <= 3) return SUB_SCORE_LABELS[worstKey] || "Uncategorized";
    }
  }
  const text = comment.toLowerCase();
  const match = ROOT_CAUSE_RULES.find((rule) => rule.keywords.some((word) => text.includes(word)));
  return match ? match.label : "Uncategorized";
}

const THEME_RULES = [
  { keywords: ["เอกสาร", "documentation"], label: "documentation" },
  { keywords: ["consent", "ยินยอม"], label: "consent" },
  { keywords: ["ง่าย", "ease of use"], label: "ease of use" },
  { keywords: ["ทีมงาน", "สนับสนุน", "ช่วยเหลือ", "support"], label: "support" },
  { keywords: ["ราคา", "แพง", "pricing"], label: "pricing" },
  { keywords: ["ช้า", "ล่าช้า", "รอ", "speed"], label: "speed" },
  { keywords: ["บั๊ก", "error", "พัง", "ล่ม", "bug"], label: "bug" },
  { keywords: ["ซับซ้อน", "สับสน", "usability"], label: "usability" }
];

export function extractThemes(comment = "") {
  const text = comment.toLowerCase();
  const matches = THEME_RULES.filter((rule) => rule.keywords.some((word) => text.includes(word))).map((rule) => rule.label);
  return matches.length ? matches : ["general feedback"];
}

export function suggestPriority(row) {
  const category = getNpsCategory(row.score);
  if (category === "detractor") return "Open";
  return "None";
}

const PRIORITY_RANK = {
  "SLA breached": 0,
  "Detractor": 1,
  "Need callback": 2,
  "Waiting owner": 3,
  "Resolved": 4
};

export function getCasePriority(item) {
  if (item.followUpStatus === "None") return null;
  if (item.followUpStatus === "Resolved") return "Resolved";
  if (item.slaHoursLeft != null && item.slaHoursLeft < 0) return "SLA breached";
  if (item.followUpStatus === "Open") return "Detractor";
  if (item.followUpStatus === "Assigned" || item.followUpStatus === "Calling") return "Need callback";
  if (item.followUpStatus === "Waiting Owner") return "Waiting owner";
  return "Detractor";
}

export function getCasePriorityRank(item) {
  const priority = getCasePriority(item);
  return priority == null ? 99 : PRIORITY_RANK[priority];
}

export function topRootCauses(items, n = 2) {
  const groups = groupBy(items, "rootCause");
  return Object.entries(groups)
    .map(([label, arr]) => ({ label, count: arr.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

export function signed(value) {
  return Number(value) > 0 ? `+${value}` : `${value}`;
}
