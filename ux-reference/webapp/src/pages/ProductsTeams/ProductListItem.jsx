export function ProductListItem({ product, teamCount, peopleCount, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left border-l-2 transition-colors ${
        selected ? "border-brand-blue bg-brand-blue-soft" : "border-transparent hover:bg-workspace"
      }`}
    >
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-sm font-bold ${
        selected ? "bg-brand-blue text-white" : "bg-workspace text-ink"
      }`}>
        {product.name.slice(0, 1).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <strong className={`block text-sm truncate ${selected ? "text-brand-blue" : "text-ink"}`}>{product.name}</strong>
        <small className="text-muted">{teamCount} team{teamCount === 1 ? "" : "s"} · {peopleCount} people</small>
      </span>
      <span className="text-muted shrink-0">›</span>
    </button>
  );
}
