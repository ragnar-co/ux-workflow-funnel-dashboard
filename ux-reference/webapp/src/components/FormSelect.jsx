import { ToolbarIcon } from "./ToolbarIcon.jsx";

export function FormSelect({ icon, value, onChange, options, disabled, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <ToolbarIcon id={icon} className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink" />
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="input w-full appearance-none pl-9 pr-8 cursor-pointer disabled:cursor-not-allowed"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ToolbarIcon id="chevronDown" className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink" />
    </div>
  );
}
