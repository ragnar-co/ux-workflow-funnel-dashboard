export function ProductSummary({ teamCount, peopleCount, activeCount }) {
  const stats = [
    { label: "Teams", value: teamCount },
    { label: "People", value: peopleCount },
    { label: "Active", value: activeCount }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-4 max-w-sm">
      {stats.map((s) => (
        <div key={s.label} className="rounded-input bg-workspace px-3 py-2 text-center">
          <strong className="text-sm mr-1.5">{s.value}</strong>
          <span className="text-xs text-muted">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
