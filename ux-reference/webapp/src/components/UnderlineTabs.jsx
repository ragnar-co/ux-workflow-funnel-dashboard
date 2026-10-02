export function UnderlineTabs({ tabs, active, onChange }) {
  return (
    <div className="flex items-center gap-6 border-b border-line mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`pb-2.5 text-sm border-b-[3px] -mb-px transition-colors ${
            active === tab.id ? "border-brand-blue text-brand-blue font-semibold" : "border-transparent text-muted hover:text-ink"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
