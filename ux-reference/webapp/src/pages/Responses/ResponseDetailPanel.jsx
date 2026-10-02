import { useNavigate } from "react-router-dom";
import { useAppState } from "../../store/AppStateContext.jsx";
import { getNpsCategory, getMonthTag, getQuarterTag, extractThemes } from "../../domain/nps.js";
import { CategoryPill } from "../../components/StatusPill.jsx";

const META_ICONS = {
  Product: "M3 7h18v13H3zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2",
  Team: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0",
  Owner: "M12 12a4 4 0 100-8 4 4 0 000 8zM5 21a7 7 0 0114 0",
  Source: "M4 4h16v12H8l-4 4z",
  Date: "M3 5h18v16H3zM8 3v4M16 3v4M3 10h18",
  Quarter: "M5 21V10M12 21V4M19 21v-7"
};

function MetaIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-muted shrink-0 mt-0.5">
      <path d={META_ICONS[name]} />
    </svg>
  );
}

export function ResponseDetailPanel({ item, index, total, onPrev, onNext }) {
  const navigate = useNavigate();
  const { updateResponse } = useAppState();

  if (!item) {
    return (
      <div className="rounded-[16px] border border-line bg-surface shadow-[0_10px_25px_rgba(16,24,40,0.06)] p-6 text-sm text-muted text-center">
        Select a response to see its details.
      </div>
    );
  }

  const category = getNpsCategory(item.score);
  const monthTag = item.monthTag || getMonthTag(item.date);
  const quarterTag = item.quarterTag || getQuarterTag(item.date);
  const themes = item.themes?.length ? item.themes : extractThemes(item.comment);

  const meta = [
    ["Product", item.product],
    ["Team", item.team || "—"],
    ["Owner", item.responsible || "Unassigned"],
    ["Source", item.source],
    ["Date", item.date],
    ["Quarter", `${monthTag || "—"} · ${quarterTag || "—"}`]
  ];

  return (
    <div className="rounded-[16px] border border-line bg-surface shadow-[0_10px_25px_rgba(16,24,40,0.06)] p-5 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-muted">
          <button onClick={onPrev} disabled={index <= 0} className="grid h-6.5 w-6.5 place-items-center rounded-[7px] border border-line disabled:opacity-30">‹</button>
          {index + 1} of {total}
          <button onClick={onNext} disabled={index >= total - 1} className="grid h-6.5 w-6.5 place-items-center rounded-[7px] border border-line disabled:opacity-30">›</button>
        </div>
        <button className="text-muted px-1 text-sm">•••</button>
      </div>

      <div className="flex items-start justify-between gap-3 mb-1">
        <h2 className="text-lg font-extrabold leading-tight">{item.customer}</h2>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <strong className="text-sm">{item.score}/10</strong>
          <CategoryPill category={category} />
        </div>
      </div>
      <p className="text-xs text-muted mb-4">{item.product} · {item.team || "—"} · {item.responsible || "Unassigned"}</p>

      <blockquote className="rounded-[11px] bg-workspace border-l-[3px] border-brand-blue px-4 py-3 text-sm leading-relaxed text-ink mb-5">
        "{item.comment}"
      </blockquote>

      <div className="grid grid-cols-2 gap-x-3 gap-y-3 mb-5">
        {meta.map(([label, value]) => (
          <div key={label} className="flex items-start gap-2">
            <MetaIcon name={label} />
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">{label}</p>
              <p className="text-xs font-semibold text-ink truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">Detected themes</p>
      <div className="flex flex-wrap gap-1.5 mb-5">
        {themes.map((t) => (
          <span key={t} className="text-xs font-bold text-brand-blue bg-brand-blue-soft rounded-full px-2.5 py-1">{t}</span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-line">
        <button onClick={() => updateResponse(item.id, { followUpStatus: "Assigned" })} className="btn-primary">Assign</button>
        <button className="btn-secondary">Add tag</button>
        <button onClick={() => updateResponse(item.id, { followUpStatus: "Resolved" })} className="btn-secondary">Mark resolved</button>
        <button onClick={() => navigate("/response-center")} className="btn-secondary">Open in Response Center</button>
      </div>
    </div>
  );
}
