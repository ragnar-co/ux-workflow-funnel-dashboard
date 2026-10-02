import * as XLSX from "xlsx";
import { rescale1to5To10 } from "./nps.js";

function normalizeDate(raw) {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function parseXlsxFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" });
  const [header, ...body] = rows;
  const headers = (header || []).map((h) => String(h || "").trim()).filter(Boolean);

  return {
    headers,
    rows: body
      .filter((cells) => cells.some((c) => String(c || "").trim()))
      .map((cells) => header.reduce((acc, key, index) => {
        if (key) acc[key] = cells[index] ?? "";
        return acc;
      }, {}))
  };
}

function extractOverallScores(lines) {
  const scores = [];
  for (let i = 0; i < lines.length; i++) {
    const match = /^คำตอบ\s*([1-5])\s*$/.exec(lines[i]);
    if (!match) continue;
    const context = lines.slice(Math.max(0, i - 6), i).join(" ");
    if (context.includes("โดยรวม")) scores.push(Number(match[1]));
  }
  return scores;
}

function extractAllNumericAnswers(lines) {
  return lines
    .map((l) => /^คำตอบ\s*([1-5])\s*$/.exec(l))
    .filter(Boolean)
    .map((m) => Number(m[1]));
}

function extractComment(lines) {
  return lines
    .map((l) => /^คำตอบ\s*(.*)$/.exec(l)?.[1]?.trim())
    .filter((text) => text && !/^[1-5]$/.test(text) && text !== "ไม่มี")
    .join(" / ");
}

function splitSections(text) {
  return text.split(/^---\s*$/m).map((s) => s.trim()).filter(Boolean);
}

function extractSectionOwner(block) {
  const line = block.split("\n").map((l) => l.trim()).find((l) => /^ส่วนของ/.test(l));
  if (!line) return null;
  return line
    .replace(/^ส่วนของ\s*/, "")
    .replace(/\*\*/g, "")
    .replace(/^คุณ\s*/, "")
    .trim();
}

/**
 * Parses a Notion-style call-script export where one customer file can contain
 * multiple rated sections (e.g. an individual account manager AND their team),
 * each separated by "---" and headed by "ส่วนของ <name>". Each section becomes
 * its own response row so the responsible owner isn't lost when averaged away.
 */
export function parseMarkdownRecords(text, fallbackName) {
  const nameMatch = /^#\s+(.+)$/m.exec(text);
  const dueDateMatch = /Due Date:\s*(.+)/.exec(text);
  const productMatch = /Product:\s*(.+)/.exec(text);
  const customerName = (nameMatch?.[1] || fallbackName || "").trim();
  const submittedAt = dueDateMatch ? normalizeDate(dueDateMatch[1].trim()) : "";
  const productName = productMatch?.[1]?.trim() || "";

  const buildRow = (block, ownerName) => {
    const lines = block.split("\n").map((l) => l.trim());
    const overallScores = extractOverallScores(lines);
    const scoresOn5 = overallScores.length ? overallScores : extractAllNumericAnswers(lines);
    const avgScore = scoresOn5.length ? scoresOn5.reduce((a, b) => a + b, 0) / scoresOn5.length : null;
    return {
      customer_name: customerName,
      nps_score: avgScore == null ? "" : String(rescale1to5To10(avgScore)),
      comment: extractComment(lines),
      submitted_at: submittedAt,
      product_name: productName,
      team_name: ownerName || "",
      tags: ""
    };
  };

  const sectionBlocks = splitSections(text).slice(1).filter((b) => extractSectionOwner(b));
  if (sectionBlocks.length) {
    return sectionBlocks.map((block) => buildRow(block, extractSectionOwner(block)));
  }

  return [buildRow(text, "")];
}

const ROW_FIELD_KEYS = ["customer_name", "nps_score", "comment", "submitted_at", "product_name", "team_name", "tags"];

export function buildIdentityParsed(rows, fileName, fileSize) {
  return {
    fileName,
    fileSize,
    headers: [...ROW_FIELD_KEYS],
    rows,
    mapping: Object.fromEntries(ROW_FIELD_KEYS.map((k) => [k, k]))
  };
}
