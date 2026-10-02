import { useEffect, useRef, useState } from "react";
import { ToolbarIcon } from "./ToolbarIcon.jsx";

export function ColumnFilterMenu({ label, options, selected, onChange, align = "left", className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const allSelected = selected.length === options.length;
  const activeCount = allSelected ? 0 : selected.length;
  const isActive = activeCount > 0 || open;

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggleValue = (value) => {
    if (value === "__all__") {
      onChange(allSelected ? [] : options.map((o) => o.value));
      return;
    }
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  return (
    <th ref={ref} className={`relative py-2.5 pr-3 ${className}`}>
      <span aria-hidden className={`pointer-events-none absolute inset-0 transition-colors ${isActive ? "bg-brand-blue-soft/50" : ""}`} />
      <button onClick={() => setOpen((v) => !v)} className="relative inline-flex items-center gap-1.5 uppercase tracking-wider">
        <span className={isActive ? "text-brand-blue" : ""}>{label}</span>
        <ToolbarIcon id="filter" className={`h-3 w-3 ${isActive ? "text-brand-blue" : "text-muted/60"}`} />
        {activeCount > 0 && (
          <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-blue text-[9px] font-bold text-white">{activeCount}</span>
        )}
      </button>

      {open && (
        <div className={`absolute top-full z-20 mt-1 w-48 rounded-input border border-line bg-surface shadow-[0_10px_25px_rgba(16,24,40,0.15)] py-1.5 normal-case font-normal tracking-normal text-left ${align === "right" ? "right-0" : "left-0"}`}>
          <CheckboxRow label="All" checked={allSelected} onClick={() => toggleValue("__all__")} />
          <div className="my-1 border-t border-line" />
          {options.map((opt) => (
            <CheckboxRow key={opt.value} label={opt.label} checked={selected.includes(opt.value)} onClick={() => toggleValue(opt.value)} />
          ))}
        </div>
      )}
    </th>
  );
}

function CheckboxRow({ label, checked, onClick }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-workspace">
      <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border ${checked ? "border-brand-blue bg-brand-blue text-white" : "border-line"}`}>
        {checked && <ToolbarIcon id="check" className="h-2.5 w-2.5" />}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}
