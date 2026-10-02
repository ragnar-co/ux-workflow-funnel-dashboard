import { getNpsCategory } from "../../domain/nps.js";
import { CategoryPill } from "../../components/StatusPill.jsx";

function getInitial(name) {
  const clean = name.replace(/\(.*?\)/g, "").trim();
  const parts = clean.split(/\s+/).filter((p) => p && p !== "คุณ");
  const source = parts[0] || clean;
  return source.slice(0, 2).toUpperCase();
}

export function ResponseListRow({ item, selected, checked, onSelect, onToggleCheck }) {
  const category = getNpsCategory(item.score);

  return (
    <div
      onClick={onSelect}
      className={`grid grid-cols-[26px_1.7fr_120px_1fr_100px_88px] gap-3 items-center px-4 py-3 border-t border-line cursor-pointer transition-colors ${
        selected ? "bg-brand-blue-soft/70 shadow-[inset_2px_0_0_0_var(--color-brand-blue)]" : "hover:bg-workspace"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onClick={(e) => e.stopPropagation()}
        onChange={onToggleCheck}
        className="h-4 w-4 accent-brand-blue"
      />
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-blue-soft text-xs font-bold text-brand-blue">
          {getInitial(item.customer)}
        </span>
        <div className="min-w-0">
          <strong className="block text-sm truncate">{item.customer}</strong>
          <p className="text-xs text-muted truncate">{item.comment}</p>
        </div>
      </div>
      <span className="flex items-center gap-1.5">
        <strong className="text-sm">{item.score}</strong>
        <CategoryPill category={category} />
      </span>
      <span className="text-xs text-ink min-w-0">
        <span className="block truncate">{item.product}</span>
        <span className="block text-muted truncate">{item.team || "—"}</span>
      </span>
      <span className="text-xs font-bold text-ink/70 bg-workspace border border-line rounded-[6px] px-2 py-1 text-center whitespace-nowrap justify-self-start">
        {item.source}
      </span>
      <span className="text-xs text-muted text-right whitespace-nowrap">{item.date}</span>
    </div>
  );
}
