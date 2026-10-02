import { getNpsCategory, getNpsScore, getNpsLevel, signed } from "./nps.js";
import { getCsatScore, getDatasetPeriod, getSurveyTypeLabel } from "./surveys.js";
import { csvEscape } from "./exportUtils.js";

export const NPS_CALC_TH = "NPS คำนวณจาก % Promoters ลบ % Detractors โดยคะแนนอยู่ในช่วง -100 ถึง +100";

// Score band drives which narrative to use — thresholds match the report's own scale,
// not the app-wide getNpsLevel badge (which uses different cutoffs for the on-screen chip).
function getReportScoreBand(nps) {
  if (nps >= 50) return "excellent";
  if (nps >= 30) return "good";
  if (nps >= 0) return "neutral";
  return "attention";
}

// Which group to lead the narrative with: a high Detractor share always wins (risk first),
// otherwise whichever of Promoter/Passive has the larger share drives the story.
function pickNarrativeVariant(promoterPct, passivePct, detractorPct) {
  if (detractorPct >= 20) return "detractorHigh";
  return promoterPct >= passivePct ? "promoter" : "passive";
}

const REPORT_NARRATIVES = {
  excellent: {
    promoter: {
      insight: "คะแนน NPS อยู่ในระดับดีเยี่ยม สะท้อนว่าผู้เข้าร่วมส่วนใหญ่พึงพอใจและพร้อมแนะนำต่ออย่างชัดเจน โดยกลุ่ม Promoter คือสัดส่วนหลักของผลลัพธ์นี้",
      action: "รักษาปัจจัยที่ทำให้ Promoter พึงพอใจไว้อย่างต่อเนื่อง และขอ referral หรือ case study จากกลุ่มนี้เพื่อต่อยอดผลลัพธ์"
    },
    passive: {
      insight: "คะแนน NPS อยู่ในระดับดีเยี่ยม แต่สัดส่วน Passive ยังสูงกว่าที่ควรเมื่อเทียบกับคะแนนโดยรวม แปลว่ายังมีโอกาสเปลี่ยนกลุ่มนี้ให้กลายเป็น Promoter ได้อีก",
      action: "วิเคราะห์ความคิดเห็นของกลุ่ม Passive เพื่อหาสิ่งที่ขาดไปเพียงเล็กน้อยก่อนจะกลายเป็นผู้แนะนำ พร้อมรักษามาตรฐานที่ทำให้ Promoter พึงพอใจ"
    },
    detractorHigh: {
      insight: "แม้คะแนนโดยรวมอยู่ในระดับดีเยี่ยม แต่ยังมีกลุ่ม Detractor ในสัดส่วนที่ควรระวัง ซึ่งอาจกระทบภาพรวมหากปล่อยไว้โดยไม่ติดตาม",
      action: "ติดตาม Detractor เป็นลำดับแรกเพื่อจำกัดความเสี่ยง แม้คะแนนรวมจะอยู่ในระดับดีเยี่ยมก็ตาม"
    }
  },
  good: {
    promoter: {
      insight: "คะแนน NPS อยู่ในระดับดี สะท้อนว่าอีเวนต์ได้รับการตอบรับเชิงบวก และมี Promoter มากกว่า Detractor ชัดเจน อย่างไรก็ตาม กลุ่ม Passive ยังมีสัดส่วนสูง จึงเป็นโอกาสในการยกระดับประสบการณ์ให้กลายเป็นผู้แนะนำ",
      action: "รักษาปัจจัยที่ทำให้ Promoter ให้คะแนนสูง และวิเคราะห์ความคิดเห็นของกลุ่ม Passive เพื่อหาจุดที่ยังไม่ประทับใจพอ ก่อนติดตาม Detractor เฉพาะรายเพื่อปิดความเสี่ยง"
    },
    passive: {
      insight: "คะแนน NPS อยู่ในระดับดี แต่สัดส่วน Passive สูงกว่ากลุ่ม Promoter เล็กน้อย แปลว่าผู้เข้าร่วมจำนวนมากยังไม่มั่นใจพอที่จะแนะนำต่อ แม้จะไม่ได้รู้สึกลบกับประสบการณ์นี้",
      action: "โฟกัสที่กลุ่ม Passive เป็นอันดับแรกเพื่อหาสิ่งที่ยังขาดไป พร้อมรักษาความพึงพอใจของกลุ่ม Promoter ควบคู่กัน"
    },
    detractorHigh: {
      insight: "คะแนน NPS อยู่ในระดับดีโดยรวม แต่สัดส่วน Detractor สูงกว่าที่ควร ซึ่งอาจฉุดคะแนนในรอบถัดไปหากไม่ได้รับการดูแล",
      action: "ติดตาม Detractor ก่อนเพื่อเข้าใจปัญหาหลัก จากนั้นสอบถามกลุ่ม Passive ว่าอะไรจะทำให้คะแนนเพิ่มเป็น 9–10"
    }
  },
  neutral: {
    promoter: {
      insight: "คะแนน NPS อยู่ในระดับกลาง แม้กลุ่ม Promoter จะมีสัดส่วนมากที่สุด แต่จำนวน Passive และ Detractor รวมกันยังมากพอที่จะฉุดคะแนนโดยรวมไว้",
      action: "รักษาฐาน Promoter ที่มีอยู่ และเร่งสอบถามกลุ่ม Passive ถึงสิ่งที่ยังขาดไป ควบคู่กับการติดตาม Detractor เพื่อลดความเสี่ยง"
    },
    passive: {
      insight: "คะแนน NPS อยู่ในระดับกลาง แม้จำนวน Detractor จะไม่สูง แต่สัดส่วน Passive มากที่สุด แปลว่าผู้เข้าร่วมจำนวนมากยังรู้สึกเฉย ๆ หรือยังไม่มั่นใจพอที่จะแนะนำต่อ",
      action: "โฟกัสที่กลุ่ม Passive เป็นหลัก เพื่อค้นหาว่าอะไรทำให้ยังไม่ให้คะแนน 9-10 จากนั้นจัดลำดับปัญหาที่พบบ่อย และติดตาม Detractor เพื่อเข้าใจ pain point ที่รุนแรง"
    },
    detractorHigh: {
      insight: "คะแนน NPS อยู่ในระดับกลาง และสัดส่วน Detractor ที่ค่อนข้างสูงเป็นปัจจัยหลักที่ฉุดคะแนนโดยรวมไว้ ควรให้ความสำคัญกับกลุ่มนี้ก่อน",
      action: "ติดตาม Detractor เป็นอันดับแรกเพื่อหาสาเหตุที่แท้จริง ก่อนขยายผลไปสอบถามกลุ่ม Passive เพื่อดันคะแนนให้สูงขึ้น"
    }
  },
  attention: {
    promoter: {
      insight: "คะแนน NPS ต่ำกว่าเกณฑ์ที่ควร แม้จะยังมีกลุ่ม Promoter อยู่บ้าง แต่สัดส่วน Detractor ที่มากกว่าสะท้อนว่าประสบการณ์โดยรวมยังมีปัญหาที่ต้องแก้ไขอย่างเร่งด่วน",
      action: "ติดตาม Detractor ทุกรายทันทีเพื่อหาสาเหตุร่วม พร้อมทั้งรักษาความสัมพันธ์กับกลุ่ม Promoter ที่เหลืออยู่ไม่ให้เปลี่ยนใจ"
    },
    passive: {
      insight: "คะแนน NPS ต่ำกว่าเกณฑ์ที่ควร โดยมีทั้งกลุ่ม Passive และ Detractor ในสัดส่วนที่สูง สะท้อนว่าประสบการณ์โดยรวมยังไม่ตอบโจทย์ผู้เข้าร่วมส่วนใหญ่",
      action: "จัดลำดับความสำคัญที่ Detractor ก่อนเพื่อหยุดความเสี่ยงเฉพาะหน้า จากนั้นวางแผนปรับปรุงในภาพรวมเพื่อดึงกลุ่ม Passive กลับมา"
    },
    detractorHigh: {
      insight: "คะแนน NPS อยู่ในระดับที่ต้องให้ความสนใจ เนื่องจากสัดส่วน Detractor มากกว่า Promoter อย่างชัดเจน ซึ่งสะท้อนความเสี่ยงต่อชื่อเสียงและการบอกต่อ",
      action: "ติดตาม Detractor เป็นอันดับแรกโดยด่วนเพื่อจำกัดความเสียหาย พร้อมทบทวนสาเหตุร่วมของปัญหาก่อนวางแผนแก้ไขในภาพรวม"
    }
  }
};

function buildRowReportInsight({ total, nps, promoterPct, passivePct, detractorPct }) {
  if (!total) {
    return {
      insightTh: "ยังไม่มีคำตอบที่พร้อมใช้งานสำหรับคำนวณ NPS ของอีเวนต์นี้",
      actionTh: "นำเข้าคำตอบเพิ่มเติม หรือแก้ไขแถวที่ถูกตีธงในขั้นตอน Analyze เพื่อให้ระบบคำนวณผลได้"
    };
  }
  const band = getReportScoreBand(nps);
  const variant = pickNarrativeVariant(promoterPct, passivePct, detractorPct);
  const narrative = REPORT_NARRATIVES[band][variant];
  return { insightTh: narrative.insight, actionTh: narrative.action };
}

const NPS_GROUP_LABEL = { promoter: "Promoter", passive: "Passive", detractor: "Detractor" };

function npsGroupFor(score) {
  if (score === "" || score == null) return "—";
  const n = Number(score);
  if (Number.isNaN(n) || n < 0 || n > 10) return "—";
  return NPS_GROUP_LABEL[getNpsCategory(n)];
}

function buildResponseSummaryTh(total, promoters, passives, detractors) {
  if (!total) return "ยังไม่มีคำตอบสำหรับสรุปผล";
  return `มีคำตอบทั้งหมด ${total} รายการ แบ่งเป็น Promoters ${promoters} ราย, Passives ${passives} ราย และ Detractors ${detractors} ราย`;
}

function buildFollowUpPriorityTh(promoters, passives, detractors) {
  if (detractors > 0) {
    return `ควรติดตาม Detractor ${detractors} รายก่อนเพื่อลดความเสี่ยง จากนั้นติดตามกลุ่ม Passive เพื่อดันคะแนนให้เป็น 9–10`;
  }
  if (passives > 0) {
    return `ไม่มี Detractor ควรให้ความสำคัญกับกลุ่ม Passive ${passives} ราย เพื่อดันคะแนนให้เป็น Promoter`;
  }
  return "ผู้ตอบทั้งหมดเป็น Promoter ควรรักษาความพึงพอใจนี้ไว้และขอ referral หรือรีวิวเพิ่มเติม";
}

// Datasets aren't linked to their source responses by a stable id, so we match on
// product + type plus the one extra field that reliably distinguishes separate
// imports of the same product (event date for events, quarter for satisfaction) —
// otherwise two same-product/type datasets would leak each other's responses here.
export function matchDatasetResponses(dataset, responses) {
  // Responses imported after the datasetId tagging fix carry an exact link back to
  // their dataset — use that when present. Older/seeded responses have no datasetId,
  // so fall back to the product+type+period heuristic (which can double-count across
  // datasets that happen to share the same product and period).
  const exact = responses.filter((r) => r.datasetId && r.datasetId === dataset.id);
  if (exact.length) return exact;

  return responses.filter((r) => {
    if (r.product !== dataset.product || r.npsType !== dataset.type) return false;
    if (dataset.type === "event") return r.eventDate === dataset.eventDate;
    return r.surveyPeriod === dataset.surveyPeriod;
  });
}

function toIncludedRow(r) {
  return {
    customer: r.customer || "—",
    owner: r.responsible || "Unassigned",
    score: r.score,
    nps_group: npsGroupFor(r.score),
    comment: r.comment || "",
    date: r.date || "",
    status: r.followUpStatus && r.followUpStatus !== "None" ? r.followUpStatus : "—",
    included_in_analysis: true
  };
}

function toExcludedRow(r) {
  return {
    customer: r.customer || "—",
    owner: r.owner || "Unassigned",
    score: r.score ?? "",
    nps_group: npsGroupFor(r.score),
    comment: r.comment || "",
    date: r.date || "",
    status: r.reason || "Excluded",
    included_in_analysis: false
  };
}

export function buildDatasetRowReport(dataset, responses, generatedDate) {
  const matched = matchDatasetResponses(dataset, responses);
  const includedRows = matched.map(toIncludedRow);
  const excludedRows = (dataset.excludedResponses || []).map(toExcludedRow);

  const promoters = matched.filter((r) => getNpsCategory(r.score) === "promoter").length;
  const passives = matched.filter((r) => getNpsCategory(r.score) === "passive").length;
  const detractors = matched.filter((r) => getNpsCategory(r.score) === "detractor").length;
  const total = matched.length;
  const promoterPct = total ? Math.round((promoters / total) * 100) : 0;
  const passivePct = total ? Math.round((passives / total) * 100) : 0;
  const detractorPct = total ? Math.round((detractors / total) * 100) : 0;
  const nps = total ? getNpsScore(matched) : null;
  const level = getNpsLevel(nps ?? 0);
  const csat = dataset.metrics?.includes("CSAT") && total ? getCsatScore(matched) : null;

  const validScores = matched.map((r) => Number(r.score)).filter((s) => !Number.isNaN(s));
  const avgScore = validScores.length ? Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 10) / 10 : null;

  const { insightTh, actionTh } = buildRowReportInsight({ total, nps, promoterPct, passivePct, detractorPct });

  return {
    eventName: dataset.datasetName,
    surveyType: getSurveyTypeLabel(dataset.type),
    isEvent: dataset.type === "event",
    productEvent: dataset.product,
    period: getDatasetPeriod(dataset),
    eventDate: dataset.eventDate || null,
    status: dataset.status,
    generatedDate,
    totalResponses: total,
    nps,
    level,
    promoters,
    passives,
    detractors,
    promoterPct,
    passivePct,
    detractorPct,
    csat,
    avgScore,
    responseSummaryTh: buildResponseSummaryTh(total, promoters, passives, detractors),
    followUpPriorityTh: buildFollowUpPriorityTh(promoters, passives, detractors),
    insightTh,
    actionTh,
    includedRows,
    excludedRows
  };
}

const CSV_HEADER_BASE = ["event_name", "survey_type", "product_event", "period"];
const CSV_HEADER_SATISFACTION = ["customer", "owner", "score", "nps_group", "comment", "date", "status", "included_in_analysis"];
const CSV_HEADER_EVENT = ["company", "score", "nps_group", "comment", "date", "included_in_analysis"];

export function buildRowReportCsv(report) {
  const prefix = {
    event_name: report.eventName,
    survey_type: report.surveyType,
    product_event: report.productEvent,
    period: report.period
  };
  const header = [...CSV_HEADER_BASE, ...(report.isEvent ? CSV_HEADER_EVENT : CSV_HEADER_SATISFACTION)];
  const rows = [...report.includedRows, ...report.excludedRows];
  const lines = [
    header.join(","),
    ...rows.map((r) => header.map((key) => {
      if (key in prefix) return csvEscape(prefix[key]);
      if (key === "company") return csvEscape(r.customer);
      return csvEscape(r[key]);
    }).join(","))
  ];
  return lines.join("\n");
}

function responseTableMarkdown(rows, statusHeader, isEvent) {
  if (isEvent) {
    return [
      `| Company | Score | NPS Group | Comment | Date |`,
      "| --- | --- | --- | --- | --- |",
      ...rows.map((r) => `| ${r.customer} | ${r.score} | ${r.nps_group} | ${String(r.comment || "").replace(/\|/g, "/")} | ${r.date} |`)
    ];
  }
  return [
    `| Customer | Owner | Score | NPS Group | Comment | Date | ${statusHeader} |`,
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...rows.map((r) => `| ${r.customer} | ${r.owner} | ${r.score} | ${r.nps_group} | ${String(r.comment || "").replace(/\|/g, "/")} | ${r.date} | ${r.status} |`)
  ];
}

export function buildRowReportMarkdown(report) {
  const npsLabel = report.nps == null ? "—" : signed(report.nps);
  const lines = [
    "# Event Feedback Report",
    "",
    `_Generated: ${report.generatedDate}_`,
    "",
    "## Event Overview",
    "",
    `- Event Name: ${report.eventName}`,
    `- Survey Type: ${report.surveyType}`,
    `- Product / Event: ${report.productEvent}`,
    `- Period: ${report.period}`,
    `- Status: ${report.status}`,
    `- Total Responses: ${report.totalResponses}`,
    "",
    "## Analysis Summary",
    "",
    `- NPS Score: ${npsLabel} (${report.level.label})`,
    `- Promoters: ${report.promoters} (${report.promoterPct}%)`,
    `- Passives: ${report.passives} (${report.passivePct}%)`,
    `- Detractors: ${report.detractors} (${report.detractorPct}%)`,
    ...(report.csat != null ? [`- CSAT: ${report.csat}%`] : []),
    `- Response Summary: ${report.responseSummaryTh}`,
    `- Follow-up Priority: ${report.followUpPriorityTh}`,
    "",
    "## NPS Calculation",
    "",
    NPS_CALC_TH,
    "",
    `Example: Promoters ${report.promoterPct}% - Detractors ${report.detractorPct}% = NPS ${npsLabel}`,
    "",
    "## Insight",
    "",
    report.insightTh,
    "",
    "## Recommended Action",
    "",
    report.actionTh,
    "",
    "## Response Table",
    "",
    ...responseTableMarkdown(report.includedRows, "Status", report.isEvent)
  ];

  if (report.excludedRows.length) {
    lines.push(
      "",
      "### Excluded Responses",
      "",
      ...responseTableMarkdown(report.excludedRows, "Reason", report.isEvent)
    );
  }

  return lines.join("\n");
}
