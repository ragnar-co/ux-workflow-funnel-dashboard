import { useEffect, useMemo, useState } from "react";
import { useAppState } from "../../store/AppStateContext.jsx";
import { getNpsCategory, getQuarterTag, compareQuarterTags, summarizeResponses } from "../../domain/nps.js";
import { ResponsesFilterCard } from "./ResponsesFilterCard.jsx";
import { ResponsesKpiRow } from "./ResponsesKpiRow.jsx";
import { ResponsesList } from "./ResponsesList.jsx";
import { ResponsesBoardView } from "./ResponsesBoardView.jsx";
import { ResponseDetailPanel } from "./ResponseDetailPanel.jsx";
import { Pagination } from "../../components/Pagination.jsx";
import { usePagination } from "../../hooks/useTableControls.js";

const EMPTY_FILTERS = { search: "", sentiment: "all", product: "all", quarter: "all", source: "all" };

function getSortValue(item, key) {
  if (key === "score") return item.score || 0;
  return item[key] || "";
}

export function Responses() {
  const { responses, products, appConfig } = useAppState();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, onSort] = useState({ key: "date", dir: "desc" });
  const [viewMode, setViewMode] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [checkedIds, setCheckedIds] = useState(new Set());
  const { search, sentiment, product, quarter, source } = filters;
  const setFilter = (key) => (value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const toggleSort = (key) => onSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const enriched = useMemo(() => responses.map((r) => ({ ...r, quarterTag: r.quarterTag || getQuarterTag(r.date) })), [responses]);

  const quarterOptions = useMemo(
    () => [...new Set(enriched.map((r) => r.quarterTag).filter(Boolean))].sort(compareQuarterTags),
    [enriched]
  );

  const filtered = useMemo(() => {
    let list = enriched.filter((item) =>
      (sentiment === "all" || getNpsCategory(item.score) === sentiment) &&
      (product === "all" || item.product === product) &&
      (quarter === "all" || item.quarterTag === quarter) &&
      (source === "all" || item.source === source)
    );
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((item) => `${item.customer} ${item.comment} ${item.product}`.toLowerCase().includes(q));
    list = [...list];
    list.sort((a, b) => {
      const av = getSortValue(a, sort.key);
      const bv = getSortValue(b, sort.key);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [enriched, sentiment, product, quarter, source, search, sort]);

  useEffect(() => {
    if (!filtered.some((r) => r.id === selectedId)) {
      setSelectedId(filtered[0]?.id ?? null);
    }
  }, [filtered, selectedId]);

  const selectedIndex = filtered.findIndex((r) => r.id === selectedId);
  const selectedItem = selectedIndex >= 0 ? filtered[selectedIndex] : null;

  const { page, pageSize, setPage, setPageSize, slice } = usePagination(filtered.length, 10);
  const paged = slice(filtered);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentiment, product, quarter, source, search]);

  const toggleCheck = (id) => setCheckedIds((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const summary = summarizeResponses(filtered);

  return (
    <div>
      <ResponsesFilterCard
        search={search} onSearch={setFilter("search")}
        sentiment={sentiment} onSentiment={setFilter("sentiment")}
        product={product} onProduct={setFilter("product")} productOptions={products.map((p) => p.name)}
        quarter={quarter} onQuarter={setFilter("quarter")} quarterOptions={quarterOptions}
        source={source} onSource={setFilter("source")} sourceOptions={appConfig.sources}
        sort={sort} onSort={onSort}
        count={filtered.length}
        onReset={() => setFilters(EMPTY_FILTERS)}
        viewMode={viewMode} onViewMode={setViewMode}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-4 items-start">
        <div className="rounded-[16px] border border-line bg-surface shadow-[0_10px_25px_rgba(16,24,40,0.06)] overflow-hidden">
          <ResponsesKpiRow summary={summary} />
          <div className="border-t border-line">
            {viewMode === "list" ? (
              <ResponsesList items={paged} sort={sort} onSort={toggleSort} selectedId={selectedId} checkedIds={checkedIds} onSelect={setSelectedId} onToggleCheck={toggleCheck} />
            ) : (
              <ResponsesBoardView items={paged} selectedId={selectedId} onSelect={setSelectedId} />
            )}
          </div>
          {filtered.length > 0 && (
            <Pagination page={page} pageSize={pageSize} total={filtered.length} onPage={setPage} onPageSize={setPageSize} />
          )}
        </div>

        <ResponseDetailPanel
          item={selectedItem}
          index={selectedIndex}
          total={filtered.length}
          onPrev={() => selectedIndex > 0 && setSelectedId(filtered[selectedIndex - 1].id)}
          onNext={() => selectedIndex < filtered.length - 1 && setSelectedId(filtered[selectedIndex + 1].id)}
        />
      </div>
    </div>
  );
}
