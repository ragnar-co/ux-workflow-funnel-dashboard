import { useState } from "react";
import { ToolbarIcon } from "../../components/ToolbarIcon.jsx";
import { parseDelimitedText, suggestAddNpsMapping } from "../../domain/importPipeline.js";
import { parseXlsxFile, parseMarkdownRecords, buildIdentityParsed } from "../../domain/fileParsers.js";

const TEMPLATE_CSV = "customer_name,nps_score,comment,submitted_at,product_name\nABC Corp,10,ใช้งานง่ายมาก,2026-09-18,t-reg\n";

function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ragnar-nps-import-template.csv";
  link.click();
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${Math.round(bytes / 1024)} KB`;
}

export function AttachFileStep({ surveyType, initialUpload, onBack, onContinue }) {
  const [file, setFile] = useState(initialUpload?.file || null);
  const [parsed, setParsed] = useState(initialUpload?.parsed || null);
  const [error, setError] = useState("");

  const handleFile = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    setError("");

    const mdFiles = files.filter((f) => /\.md$/i.test(f.name));
    const otherFiles = files.filter((f) => !/\.md$/i.test(f.name));

    try {
      if (mdFiles.length) {
        const rowsPerFile = await Promise.all(mdFiles.map(async (f) => {
          const text = await f.text();
          return parseMarkdownRecords(text, f.name.replace(/\.md$/i, ""));
        }));
        const rows = rowsPerFile.flat();
        const totalSize = mdFiles.reduce((sum, f) => sum + f.size, 0);
        const label = mdFiles.length === 1 ? mdFiles[0].name : `${mdFiles.length} markdown files`;
        setFile(mdFiles.length === 1 ? mdFiles[0] : null);
        setParsed(buildIdentityParsed(rows, label, totalSize));
        return;
      }

      if (otherFiles.length > 1) {
        setError("เลือกได้ทีละ 1 ไฟล์สำหรับ CSV/Excel หรือเลือกไฟล์ .md ได้หลายไฟล์พร้อมกัน");
        return;
      }

      const picked = otherFiles[0];

      if (/\.xlsx?$/i.test(picked.name)) {
        const { headers, rows } = await parseXlsxFile(picked);
        if (!headers.length || !rows.length) {
          setError("ไม่พบข้อมูลในไฟล์ กรุณาตรวจสอบว่าไฟล์มีหัวตาราง (header) และอย่างน้อย 1 แถวข้อมูล");
          return;
        }
        setFile(picked);
        setParsed({ fileName: picked.name, fileSize: picked.size, headers, rows, mapping: suggestAddNpsMapping(headers, surveyType) });
        return;
      }

      const text = await picked.text();
      const { headers, rows } = parseDelimitedText(text);
      if (!headers.length || !rows.length) {
        setError("ไม่พบข้อมูลในไฟล์ กรุณาตรวจสอบว่าไฟล์มีหัวตาราง (header) และอย่างน้อย 1 แถวข้อมูล");
        return;
      }
      setFile(picked);
      setParsed({ fileName: picked.name, fileSize: picked.size, headers, rows, mapping: suggestAddNpsMapping(headers, surveyType) });
    } catch {
      setError("ไม่สามารถอ่านไฟล์นี้ได้ กรุณาตรวจสอบรูปแบบไฟล์");
    }
  };

  return (
    <div>
      <h3 className="text-sm font-bold mb-1">Attach File</h3>
      <p className="text-xs text-muted mb-3">อัปโหลดไฟล์คำตอบแบบสอบถามที่ต้องการนำมาวิเคราะห์</p>

      <div className="mb-4 flex items-start gap-2.5 rounded-input border-l-[3px] border-brand-blue bg-brand-blue-soft px-3 py-2.5">
        <ToolbarIcon id="info" className="h-4 w-4 shrink-0 text-brand-blue mt-0.5" />
        <p className="text-xs text-ink leading-relaxed">
          แนบไฟล์คำตอบแบบสอบถาม เพื่อให้ระบบอ่านข้อมูลและกรอกรายละเอียดเบื้องต้นให้อัตโนมัติ คุณสามารถตรวจสอบและแก้ไขได้ในขั้นตอนถัดไป
        </p>
      </div>

      {!parsed ? (
        <label className="flex flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-line bg-workspace px-6 py-8 text-center cursor-pointer transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5">
          <span className="text-sm font-bold">Drag &amp; drop file(s) here</span>
          <span className="text-xs text-muted">or choose a file</span>
          <input type="file" accept=".csv,.tsv,.xlsx,.xls,.md" multiple onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="flex items-center gap-3 rounded-input border border-line bg-workspace px-4 py-3">
          <span className="text-2xl">📄</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{parsed.fileName}</p>
            <p className="text-xs text-muted">{formatSize(parsed.fileSize)} · <span className="text-brand-green font-bold">Upload complete ✓</span></p>
          </div>
          <label className="text-xs font-bold text-brand-blue hover:underline cursor-pointer">
            Replace
            <input type="file" accept=".csv,.tsv,.xlsx,.xls,.md" multiple onChange={handleFile} className="hidden" />
          </label>
          <button onClick={() => { setFile(null); setParsed(null); }} className="text-xs font-bold text-brand-blue hover:underline">Remove</button>
        </div>
      )}

      <p className="mt-2 text-xs text-muted">รองรับ CSV, Excel (.xlsx), หรือ Markdown (.md)</p>
      {error && <p className="mt-2 text-sm font-semibold text-ragnar-red">{error}</p>}
      {!parsed && (
        <button onClick={downloadTemplate} className="mt-2 text-xs font-bold text-muted hover:text-ink">Download Template</button>
      )}

      <div className="flex items-center gap-3 mt-6">
        <button onClick={onBack} className="btn-secondary">← Back</button>
        <button disabled={!parsed} onClick={() => onContinue({ file, parsed })} className="btn-primary ml-auto">Continue</button>
      </div>
    </div>
  );
}
