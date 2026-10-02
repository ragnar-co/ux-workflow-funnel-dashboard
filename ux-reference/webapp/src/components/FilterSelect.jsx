import { ToolbarIcon } from "./ToolbarIcon.jsx";

export function FilterSelect({ icon, value, onChange, options, className = "" }) {
  const current = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className={`relative inline-flex h-9 items-center gap-2 rounded-input border border-line bg-surface pl-3 pr-8 text-sm font-semibold text-ink transition-colors hover:bg-workspace cursor-pointer ${className}`}>
      <ToolbarIcon id={icon} className="h-4 w-4 shrink-0 text-ink" />
      <span className="max-w-[180px] truncate">{current?.label}</span>
      <ToolbarIcon id="chevronDown" className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
