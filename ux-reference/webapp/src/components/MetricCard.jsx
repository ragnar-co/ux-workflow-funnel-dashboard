import { Card } from "./Card.jsx";

const TONE_TEXT = {
  good: "text-brand-green",
  warning: "text-brand-amber",
  danger: "text-ragnar-red",
  neutral: "text-ink"
};

export function MetricCard({ label, value, caption, tone = "neutral" }) {
  return (
    <Card className="p-4 min-h-[122px]">
      <span className="block text-[11px] font-extrabold uppercase tracking-wider text-muted">{label}</span>
      <strong className={`block my-2 text-[28px] leading-none ${TONE_TEXT[tone]}`}>{value}</strong>
      <p className="text-xs text-muted">{caption}</p>
    </Card>
  );
}
