function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  total: "M4 6h16M4 12h16M4 18h10",
  promoter: "M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z",
  passive: "M9 15s1.5 1.5 3 1.5 3-1.5 3-1.5M9 9h.01M15 9h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  detractor: "M12 9v4M12 17h.01M10.3 3.9L2.5 18a2 2 0 001.8 3h15.4a2 2 0 001.8-3L13.7 3.9a2 2 0 00-3.4 0z"
};

export function ResponsesKpiRow({ summary }) {
  const stats = [
    { key: "total", label: "Total responses", value: summary.total, bg: "bg-workspace", iconBg: "bg-line", iconText: "text-ink", valueText: "text-ink" },
    { key: "promoter", label: "Promoters", value: summary.promoters, bg: "bg-brand-green-soft", iconBg: "bg-brand-green", iconText: "text-white", valueText: "text-brand-green" },
    { key: "passive", label: "Passives", value: summary.passives, bg: "bg-brand-amber-soft", iconBg: "bg-brand-amber", iconText: "text-white", valueText: "text-brand-amber" },
    { key: "detractor", label: "Detractors", value: summary.detractors, bg: "bg-ragnar-red-soft", iconBg: "bg-ragnar-red", iconText: "text-white", valueText: "text-ragnar-red" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
      {stats.map((s) => (
        <div key={s.key} className={`rounded-[12px] px-4 py-3 flex flex-col gap-2 ${s.bg}`}>
          <span className={`grid h-6.5 w-6.5 place-items-center rounded-[8px] ${s.iconBg} ${s.iconText}`}>
            <Icon path={ICONS[s.key]} />
          </span>
          <strong className={`text-[22px] font-extrabold leading-none ${s.valueText}`}>{s.value}</strong>
          <span className="text-[11px] font-bold text-muted">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
