import { SearchInput } from "../../components/SearchInput.jsx";
import { FilterSelect } from "../../components/FilterSelect.jsx";

const SENTIMENTS = [
  { id: "all", label: "All" },
  { id: "promoter", label: "Promoter" },
  { id: "passive", label: "Passive" },
  { id: "detractor", label: "Detractor" }
];

export function ResponsesFilterCard({
  search, onSearch, sentiment, onSentiment,
  product, onProduct, productOptions,
  quarter, onQuarter, quarterOptions,
  source, onSource, sourceOptions,
  sort, onSort, count, onReset, viewMode, onViewMode
}) {
  return (
    <div className="rounded-[16px] border border-line bg-surface shadow-[0_10px_25px_rgba(16,24,40,0.06)] p-4 mb-4">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <SearchInput value={search} onChange={onSearch} placeholder="Search customer, comment, or product..." className="flex-1 min-w-[220px]" />
        <div className="flex items-center gap-2">
          {SENTIMENTS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSentiment(s.id)}
              className={`rounded-full border px-3.5 py-2 text-xs font-bold transition-colors ${
                sentiment === s.id ? "border-brand-blue bg-brand-blue text-white" : "border-line bg-surface text-ink hover:bg-workspace"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect icon="product" value={product} onChange={onProduct} options={[{ value: "all", label: "All products" }, ...productOptions.map((p) => ({ value: p, label: p }))]} />
        <FilterSelect icon="calendar" value={quarter} onChange={onQuarter} options={[{ value: "all", label: "All quarters" }, ...quarterOptions.map((q) => ({ value: q, label: q }))]} />
        <FilterSelect icon="source" value={source} onChange={onSource} options={[{ value: "all", label: "All sources" }, ...sourceOptions.map((s) => ({ value: s.id, label: s.label }))]} />
        <FilterSelect
          icon="sort"
          value={sort.key === "score" && sort.dir === "asc" ? "lowest" : "newest"}
          onChange={(v) => onSort(v === "lowest" ? { key: "score", dir: "asc" } : { key: "date", dir: "desc" })}
          options={[{ value: "newest", label: "Newest first" }, { value: "lowest", label: "Lowest score first" }]}
        />

        <span className="text-xs font-bold text-muted whitespace-nowrap">{count} responses</span>
        <button onClick={onReset} className="text-xs font-bold text-brand-blue hover:underline whitespace-nowrap">Reset filters</button>

        <div className="flex-1" />

        <div className="flex items-center gap-1 rounded-full bg-workspace p-1">
          <button
            onClick={() => onViewMode("list")}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${viewMode === "list" ? "bg-surface text-ink shadow-[0_1px_2px_rgba(16,24,40,0.15)]" : "text-muted hover:text-ink"}`}
          >
            List
          </button>
          <button
            onClick={() => onViewMode("board")}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${viewMode === "board" ? "bg-surface text-ink shadow-[0_1px_2px_rgba(16,24,40,0.15)]" : "text-muted hover:text-ink"}`}
          >
            Board
          </button>
        </div>
      </div>
    </div>
  );
}
