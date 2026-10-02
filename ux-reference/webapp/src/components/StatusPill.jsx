const CATEGORY_STYLE = {
  promoter: "bg-brand-green-soft text-brand-green",
  passive: "bg-brand-amber-soft text-brand-amber",
  detractor: "bg-ragnar-red-soft text-ragnar-red"
};

const PRIORITY_STYLE = {
  "SLA breached": "bg-ragnar-red-soft text-ragnar-red",
  "Detractor": "bg-ragnar-red-soft text-ragnar-red",
  "Need callback": "bg-brand-amber-soft text-brand-amber",
  "Waiting owner": "bg-brand-blue-soft text-brand-blue",
  "Resolved": "bg-brand-green-soft text-brand-green"
};

export function CategoryPill({ category }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${CATEGORY_STYLE[category] || "bg-workspace text-muted"}`}>
      {category}
    </span>
  );
}

export function PriorityPill({ priority }) {
  if (!priority) return null;
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${PRIORITY_STYLE[priority] || "bg-workspace text-muted"}`}>
      {priority}
    </span>
  );
}

export function StatusChip({ status = "Active" }) {
  const isActive = status === "Active";
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isActive ? "bg-brand-green-soft text-brand-green" : "bg-workspace text-muted"}`}>
      {status}
    </span>
  );
}

const DATASET_STATUS_STYLE = {
  "Ready": "bg-brand-green-soft text-brand-green",
  "Completed": "bg-brand-green-soft text-brand-green",
  "Needs Review": "bg-brand-amber-soft text-brand-amber",
  "Processing": "bg-brand-amber-soft text-brand-amber",
  "Draft": "bg-workspace text-muted"
};

export function DatasetStatusChip({ status = "Draft" }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${DATASET_STATUS_STYLE[status] || "bg-workspace text-muted"}`}>
      {status}
    </span>
  );
}

const METRIC_STYLE = {
  NPS: "bg-brand-blue-soft text-brand-blue",
  CSAT: "bg-brand-green-soft text-brand-green",
  Topics: "bg-workspace text-ink"
};

export function MetricChip({ metric }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${METRIC_STYLE[metric] || "bg-workspace text-muted"}`}>
      {metric}
    </span>
  );
}

export function MetricChipRow({ metrics = [] }) {
  return (
    <div className="flex flex-nowrap items-center gap-1 whitespace-nowrap">
      {metrics.map((m) => <MetricChip key={m} metric={m} />)}
    </div>
  );
}
