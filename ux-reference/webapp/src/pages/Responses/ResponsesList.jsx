import { ResponseListRow } from "./ResponseListRow.jsx";
import { SortToggle } from "../../components/SortableTh.jsx";

export function ResponsesList({ items, sort, onSort, selectedId, checkedIds, onSelect, onToggleCheck }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted text-center py-10">No responses match your filters.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-[26px_1.7fr_120px_1fr_100px_88px] gap-3 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-muted bg-workspace">
        <span></span>
        <span><SortToggle label="Respondent" sortKey="customer" sort={sort} onSort={onSort} /></span>
        <span><SortToggle label="Score" sortKey="score" sort={sort} onSort={onSort} /></span>
        <span><SortToggle label="Product / Team" sortKey="product" sort={sort} onSort={onSort} /></span>
        <span>Source</span>
        <span className="text-right"><SortToggle label="Date" sortKey="date" sort={sort} onSort={onSort} align="right" /></span>
      </div>
      <div>
        {items.map((item) => (
          <ResponseListRow
            key={item.id}
            item={item}
            selected={item.id === selectedId}
            checked={checkedIds.has(item.id)}
            onSelect={() => onSelect(item.id)}
            onToggleCheck={() => onToggleCheck(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
