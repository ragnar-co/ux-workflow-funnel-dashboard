import { getNpsCategory } from "../../domain/nps.js";
import { Card } from "../../components/Card.jsx";
import { CategoryPill } from "../../components/StatusPill.jsx";

export function ResponsesBoardView({ items, selectedId, onSelect }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted text-center py-10">No responses match your filters.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
      {items.map((item) => (
        <Card
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`p-4 min-h-[190px] flex flex-col cursor-pointer transition-colors ${item.id === selectedId ? "border-brand-blue bg-brand-blue-soft/40" : "hover:bg-workspace"}`}
        >
          <div className="flex items-center justify-between mb-2">
            <strong className="text-sm">{item.customer}</strong>
            <span className="text-xs text-muted flex items-center gap-1.5">{item.score}/10 <CategoryPill category={getNpsCategory(item.score)} /></span>
          </div>
          <p className="text-xs text-muted mb-3">{item.product} · {item.team || "—"} · {item.responsible}</p>
          <blockquote className="text-sm text-ink/80 border-l-2 border-line pl-3 flex-1 line-clamp-3">{item.comment}</blockquote>
          <div className="flex justify-between mt-3 text-xs text-muted">
            <span className="font-bold text-ink/70 bg-workspace border border-line rounded-[6px] px-2 py-1">{item.source}</span>
            <span>{item.date}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
