const PATHS = {
  search: ["M11 19a8 8 0 100-16 8 8 0 000 16z", "M21 21l-4.35-4.35"],
  calendar: "M3 5h18v16H3zM8 3v4M16 3v4M3 10h18",
  product: "M3 7h18v13H3zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2",
  team: [
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2",
    "M9 11a4 4 0 100-8 4 4 0 000 8z",
    "M23 21v-2a4 4 0 00-3-3.87",
    "M16 3.13a4 4 0 010 7.75"
  ],
  owner: "M12 12a4 4 0 100-8 4 4 0 000 8zM5 21a7 7 0 0114 0",
  source: "M4 4h16v12H8l-4 4z",
  sort: "M8 9l4-4 4 4M8 15l4 4 4-4",
  status: "M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0",
  tag: "M20.59 13.41L11 3.83A2 2 0 009.59 3.24L3 3v6.59a2 2 0 00.59 1.41l9.58 9.58a2 2 0 002.82 0l6.59-6.59a2 2 0 000-2.83zM7.5 7.5h.01",
  chevronDown: "M6 9l6 6 6-6",
  chevronUp: "M6 15l6-6 6 6",
  chevronRight: "M9 6l6 6-6 6",
  filter: "M3 4h18l-7 8.5V19l-4 2v-8.5z",
  check: "M5 12l4 4 10-10",
  info: ["M21 12a9 9 0 11-18 0 9 9 0 0118 0", "M12 16v-4", "M12 8h.01"],
  refresh: "M21 12a9 9 0 11-3.2-6.9M21 4v5h-5",
  download: ["M12 3v12", "M7 10l5 5 5-5", "M5 21h14"],
  fileExport: ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6", "M12 11v6", "M9.5 14.5L12 17l2.5-2.5"],
  trash: ["M3 6h18", "M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2", "M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"],
  edit: ["M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"],
  fileText: ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6", "M8 13h8", "M8 17h8", "M8 9h1"],
  table: ["M3 4h18v16H3z", "M3 10h18", "M3 16h18", "M9.5 4v16"],
  fileCode: ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", "M14 2v6h6", "M9.5 12.5L7 15l2.5 2.5", "M14.5 12.5L17 15l-2.5 2.5"]
};

export function ToolbarIcon({ id, className = "h-4 w-4" }) {
  const d = PATHS[id];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {Array.isArray(d) ? d.map((path) => <path key={path} d={path} />) : <path d={d} />}
    </svg>
  );
}
