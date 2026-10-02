import { useState } from "react";
import { useAppState } from "../../store/AppStateContext.jsx";
import { ToolbarIcon } from "../../components/ToolbarIcon.jsx";

const TYPE_ICON = { satisfaction: "product", event: "calendar" };
const TYPE_DESC = {
  satisfaction: "Recurring customer satisfaction and NPS tracking for a product.",
  event: "Post-event or workshop feedback tied to a specific date."
};

export function SurveyTypeStep({ value, onCancel, onContinue }) {
  const { appConfig } = useAppState();
  const [selected, setSelected] = useState(value || null);

  return (
    <div>
      <h3 className="text-sm font-bold mb-1">Choose Survey Type</h3>
      <p className="text-xs text-muted mb-4">This decides what fields and metrics this survey will use.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {appConfig.surveyTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`flex items-start gap-3 rounded-input border-2 px-4 py-3 text-left transition-colors ${
              selected === t.id ? "border-brand-blue bg-brand-blue-soft/40" : "border-line hover:bg-workspace"
            }`}
          >
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] ${selected === t.id ? "bg-brand-blue text-white" : "bg-workspace text-ink"}`}>
              <ToolbarIcon id={TYPE_ICON[t.id] || "tag"} className="h-4.5 w-4.5" />
            </span>
            <span>
              <strong className="block text-sm">{t.label}</strong>
              <span className="text-xs text-muted">{TYPE_DESC[t.id]}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
        <button disabled={!selected} onClick={() => onContinue(selected)} className="btn-primary ml-auto">Next →</button>
      </div>
    </div>
  );
}
