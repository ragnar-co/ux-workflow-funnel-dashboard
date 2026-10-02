import { ToolbarIcon } from "./ToolbarIcon.jsx";

export function SortToggle({ label, sortKey, sort, onSort, align = "left" }) {
  const active = sort?.key === sortKey;
  const iconId = active ? (sort.dir === "asc" ? "chevronUp" : "chevronDown") : "sort";

  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`inline-flex items-center gap-1 uppercase tracking-wider hover:text-ink transition-colors ${align === "right" ? "flex-row-reverse" : ""} ${active ? "text-brand-blue" : ""}`}
    >
      {label}
      <ToolbarIcon id={iconId} className={`h-3 w-3 ${active ? "text-brand-blue" : "text-muted/60"}`} />
    </button>
  );
}

export function SortableTh({ label, sortKey, sort, onSort, align = "left", className = "" }) {
  return (
    <th className={`py-2.5 pr-3 select-none ${className}`}>
      <SortToggle label={label} sortKey={sortKey} sort={sort} onSort={onSort} align={align} />
    </th>
  );
}
