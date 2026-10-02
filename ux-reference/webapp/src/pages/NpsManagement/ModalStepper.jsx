export function ModalStepper({ steps, activeIndex }) {
  return (
    <div className="flex items-center mb-6">
      {steps.map((label, index) => {
        const isActive = index === activeIndex;
        const isDone = index < activeIndex;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                  isActive ? "bg-brand-blue text-white" : isDone ? "bg-brand-blue-soft text-brand-blue" : "bg-workspace text-muted"
                }`}
              >
                {index + 1}
              </span>
              <span className={`text-xs font-semibold whitespace-nowrap ${isActive ? "text-brand-blue" : isDone ? "text-ink" : "text-muted"}`}>
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className={`mx-2 h-0.5 flex-1 ${isDone ? "bg-brand-blue" : "bg-line"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
