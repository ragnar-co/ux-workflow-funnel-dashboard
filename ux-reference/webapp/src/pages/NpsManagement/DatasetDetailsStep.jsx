import { useState } from "react";
import { useAppState } from "../../store/AppStateContext.jsx";
import { FormSelect } from "../../components/FormSelect.jsx";
import { applyAddNpsMapping } from "../../domain/importPipeline.js";
import { getQuarterTag } from "../../domain/nps.js";

function humanizeFileName(fileName) {
  return fileName.replace(/\.[^./]+$/, "").trim();
}

// Derives Survey Name / Product / Period suggestions from the attached file.
// Only ever consulted from useState's lazy initializer, so it runs once per
// fresh upload — not on every re-render, and never once the user has edited
// the form (see the `initial` short-circuit at each call site).
function computeAutoFill(uploaded, isEvent, products) {
  if (!uploaded?.parsed) return null;
  const { parsed } = uploaded;
  const normalizedRows = applyAddNpsMapping(parsed.rows, parsed.mapping);
  const humanized = humanizeFileName(parsed.fileName);

  const productValues = [...new Set(normalizedRows.map((r) => String(r.product_name || "").trim()).filter(Boolean))];
  const matchedProducts = isEvent
    ? productValues.map((v) => products.find((p) => p.name.toLowerCase() === v.toLowerCase())?.name).filter(Boolean)
    : [];
  const matchedSingleProduct = !isEvent && productValues.length
    ? products.find((p) => p.name.toLowerCase() === productValues[0].toLowerCase())?.name || null
    : null;

  const dates = normalizedRows.map((r) => new Date(r.submitted_at)).filter((d) => !Number.isNaN(d.getTime()));
  let earliestDate = null;
  if (dates.length) {
    const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
    const y = earliest.getFullYear();
    const m = String(earliest.getMonth() + 1).padStart(2, "0");
    const d = String(earliest.getDate()).padStart(2, "0");
    earliestDate = `${y}-${m}-${d}`;
  }

  return { humanized, matchedProducts, matchedSingleProduct, earliestDate };
}

export function DatasetDetailsStep({ surveyType, initial, uploaded, onBack, onContinue }) {
  const { appConfig, products } = useAppState();
  const defaultQuarter = appConfig.quarters[appConfig.quarters.length - 2] || appConfig.quarters[0];
  const typeLabel = appConfig.surveyTypes.find((t) => t.id === surveyType)?.shortLabel || "Survey";
  const isEvent = surveyType === "event";

  const [form, setForm] = useState(() => {
    if (initial) return initial;
    const auto = computeAutoFill(uploaded, isEvent, products);
    const quarterTag = auto?.earliestDate ? getQuarterTag(auto.earliestDate) : null;
    return {
      datasetName: auto?.humanized || "",
      product: auto?.matchedSingleProduct || products[0]?.name || "",
      eventName: (isEvent && auto?.humanized) || "",
      period: !isEvent ? ((quarterTag && appConfig.quarters.includes(quarterTag) ? quarterTag : defaultQuarter)) : "",
      eventDate: (isEvent && auto?.earliestDate) || new Date().toISOString().slice(0, 10),
      description: ""
    };
  });
  const [nameTouched, setNameTouched] = useState(!!initial);

  const [productList, setProductList] = useState(() => {
    if (!isEvent) return [];
    const raw = initial?.product || "";
    if (raw) return raw.split(",").map((s) => s.trim()).filter(Boolean);
    return computeAutoFill(uploaded, isEvent, products)?.matchedProducts || [];
  });

  const nameSourceKey = isEvent ? "eventName" : "product";

  const addProduct = (name) => {
    if (!name || productList.includes(name)) return;
    setProductList((prev) => [...prev, name]);
  };

  const removeProduct = (name) => {
    setProductList((prev) => prev.filter((p) => p !== name));
  };

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (!nameTouched && key === nameSourceKey && value.trim()) {
        next.datasetName = `${value} ${typeLabel}`;
      }
      return next;
    });
  };

  const setDatasetName = (e) => {
    setNameTouched(true);
    setForm((prev) => ({ ...prev, datasetName: e.target.value }));
  };

  const periodValue = isEvent ? form.eventDate : form.period;
  const nameValue = isEvent ? form.eventName : form.product;
  const productValue = isEvent ? productList.join(", ") : form.product;
  const availableProducts = products.filter((p) => !productList.includes(p.name));
  const canContinue = form.datasetName.trim() && nameValue.trim() && productValue.trim() && periodValue;

  return (
    <div>
      <h3 className="text-sm font-bold mb-1">Survey Details</h3>
      <p className="text-xs text-muted mb-4">{typeLabel} · review the details auto-filled from your file.</p>

      {uploaded?.parsed && (
        <p className="mb-4 text-xs text-brand-blue">รายละเอียดด้านล่างถูกกรอกอัตโนมัติจากไฟล์ {uploaded.parsed.fileName} — ตรวจสอบและแก้ไขได้ก่อนไปต่อ</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Survey Name *" className="col-span-2">
          <input value={form.datasetName} onChange={setDatasetName} placeholder={`e.g. ${typeLabel} Q3 2026`} className="input" />
        </Field>

        <Field label={isEvent ? "Event Name *" : "Product *"}>
          {isEvent ? (
            <input value={form.eventName} onChange={set("eventName")} placeholder="e.g. PDPA Seminar" className="input" />
          ) : (
            <FormSelect icon="product" value={form.product} onChange={set("product")} options={products.map((p) => ({ value: p.name, label: p.name }))} />
          )}
        </Field>

        {isEvent ? (
          <Field label="Event Date *">
            <input type="date" value={form.eventDate} onChange={set("eventDate")} className="input" />
          </Field>
        ) : (
          <Field label="Period *">
            <FormSelect icon="calendar" value={form.period} onChange={set("period")} options={appConfig.quarters.map((q) => ({ value: q, label: q }))} />
          </Field>
        )}

        {isEvent && (
          <Field label="Product *" className="col-span-2">
            <div className="rounded-input border border-line bg-surface px-3 py-2">
              {productList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {productList.map((name) => (
                    <span key={name} className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue-soft px-2.5 py-1 text-xs font-bold text-brand-blue">
                      {name}
                      <button type="button" onClick={() => removeProduct(name)} className="leading-none hover:opacity-70">×</button>
                    </span>
                  ))}
                </div>
              )}
              {availableProducts.length > 0 && (
                <select
                  value=""
                  onChange={(e) => addProduct(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-ink normal-case tracking-normal outline-none cursor-pointer"
                >
                  <option value="" disabled>+ Add product...</option>
                  {availableProducts.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
                </select>
              )}
            </div>
          </Field>
        )}
        <Field label="Description" className="col-span-2">
          <textarea value={form.description} onChange={set("description")} rows={2} placeholder="Short description of this survey..." className="input" />
        </Field>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button onClick={onBack} className="btn-secondary">← Back</button>
        <button disabled={!canContinue} onClick={() => onContinue({ ...form, product: productValue })} className="btn-primary ml-auto">Next →</button>
      </div>
    </div>
  );
}

function Field({ label, className = "", children }) {
  return (
    <label className={`grid gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-muted ${className}`}>
      {label}
      {children}
    </label>
  );
}
