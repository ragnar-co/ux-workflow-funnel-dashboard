const PAGE_SIZES = [5, 10, 25, 50];

export function Pagination({ page, pageSize, total, onPage, onPageSize }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-line text-sm text-muted">
      <select
        value={pageSize}
        onChange={(e) => onPageSize(Number(e.target.value))}
        className="rounded-input border border-line bg-surface px-2 py-1 text-xs font-semibold text-ink"
      >
        {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <span className="whitespace-nowrap">{start}-{end} of {total}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="grid h-7 w-7 place-items-center rounded-input border border-line disabled:opacity-30 hover:bg-workspace"
        >
          ‹
        </button>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages}
          className="grid h-7 w-7 place-items-center rounded-input border border-line disabled:opacity-30 hover:bg-workspace"
        >
          ›
        </button>
      </div>
    </div>
  );
}
