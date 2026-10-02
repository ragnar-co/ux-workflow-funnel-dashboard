import { useEffect, useState } from "react";

export function useSort(defaultKey, defaultDir = "asc") {
  const [sort, setSort] = useState({ key: defaultKey, dir: defaultDir });
  const onSort = (key) => setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  return [sort, onSort];
}

export function usePagination(total, initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (page > totalPages) setPage(totalPages);
  }, [total, pageSize, page]);

  const slice = (list) => list.slice((page - 1) * pageSize, page * pageSize);

  return { page, pageSize, setPage, setPageSize, slice };
}
