import { useMemo, useState } from "react";
import { useAppState } from "../store/AppStateContext.jsx";
import { getCasePriority, getCasePriorityRank } from "../domain/nps.js";
import { Card } from "../components/Card.jsx";
import { PriorityPill } from "../components/StatusPill.jsx";
import { FormSelect } from "../components/FormSelect.jsx";

const ROOT_CAUSES = ["Response Speed", "Pricing", "Usability", "Product Bug", "Positive Experience", "Uncategorized"];
const STATUSES = ["Open", "Assigned", "Calling", "Waiting Owner", "Resolved"];

export function ResponseCenter() {
  const { responses, people, updateResponse } = useAppState();
  const cases = useMemo(
    () => responses.filter((r) => r.followUpStatus !== "None").sort((a, b) => getCasePriorityRank(a) - getCasePriorityRank(b)),
    [responses]
  );
  const [selectedId, setSelectedId] = useState(cases[0]?.id || null);
  const [noteDraft, setNoteDraft] = useState("");
  const [actionDraft, setActionDraft] = useState("");

  const selected = cases.find((c) => c.id === selectedId) || null;

  const patch = (patchObj) => selected && updateResponse(selected.id, patchObj);

  const addNote = () => {
    if (!noteDraft.trim() || !selected) return;
    const notes = [...(selected.notes || []), { text: noteDraft.trim(), at: new Date().toISOString().slice(0, 16).replace("T", " ") }];
    patch({ notes });
    setNoteDraft("");
  };

  const addActionItem = () => {
    if (!actionDraft.trim() || !selected) return;
    const actionItems = [...(selected.actionItems || []), { text: actionDraft.trim(), done: false }];
    patch({ actionItems });
    setActionDraft("");
  };

  const toggleActionItem = (index) => {
    if (!selected) return;
    const actionItems = (selected.actionItems || []).map((item, i) => (i === index ? { ...item, done: !item.done } : item));
    patch({ actionItems });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-4">
      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <h2 className="text-base font-bold">Follow-up Cases</h2>
          <p className="text-xs text-muted">Sorted by priority: SLA breached → Detractor → Need callback → Waiting owner → Resolved</p>
        </div>
        <div className="max-h-[640px] overflow-y-auto">
          {cases.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left px-5 py-3.5 border-b border-line flex items-center justify-between gap-3 ${selectedId === item.id ? "bg-brand-blue-soft" : "hover:bg-workspace"}`}
            >
              <span>
                <strong className="block text-sm">{item.customer}</strong>
                <small className="text-muted">{item.product} · {item.team} · {item.responsible}</small>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted">{item.score}/10</span>
                <PriorityPill priority={getCasePriority(item)} />
              </span>
            </button>
          ))}
          {cases.length === 0 && <p className="p-6 text-sm text-muted text-center">No active follow-up cases.</p>}
        </div>
      </Card>

      <Card className="p-5">
        {!selected && <p className="text-sm text-muted">Select a case to manage it.</p>}
        {selected && (
          <div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h2 className="text-base font-bold">{selected.customer}</h2>
                <p className="text-xs text-muted">{selected.product} · {selected.team} · {selected.score}/10 · {selected.date}</p>
              </div>
              <PriorityPill priority={getCasePriority(selected)} />
            </div>
            <blockquote className="text-sm border-l-2 border-line pl-3 my-3 text-ink/80">{selected.comment}</blockquote>
            {selected.slaHoursLeft != null && (
              <p className={`text-xs font-bold mb-4 ${selected.slaHoursLeft < 0 ? "text-ragnar-red" : "text-muted"}`}>
                {selected.slaHoursLeft < 0 ? `SLA breached ${Math.abs(selected.slaHoursLeft)}h ago` : `SLA ${selected.slaHoursLeft}h remaining`}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <label className="grid gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-muted">
                Status
                <FormSelect
                  icon="status"
                  value={selected.followUpStatus}
                  onChange={(e) => patch({ followUpStatus: e.target.value })}
                  options={STATUSES.map((s) => ({ value: s, label: s }))}
                />
              </label>
              <label className="grid gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-muted">
                Root Cause
                <FormSelect
                  icon="tag"
                  value={selected.rootCause}
                  onChange={(e) => patch({ rootCause: e.target.value })}
                  options={ROOT_CAUSES.map((rc) => ({ value: rc, label: rc }))}
                />
              </label>
              <label className="grid gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-muted col-span-2">
                Assign Callback
                <FormSelect
                  icon="owner"
                  value={selected.responsible}
                  onChange={(e) => patch({ responsible: e.target.value })}
                  options={[
                    { value: selected.responsible, label: selected.responsible },
                    ...people.filter((p) => p.name !== selected.responsible).map((p) => ({ value: p.name, label: p.name }))
                  ]}
                />
              </label>
            </div>

            <div className="mb-4">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-2">Notes</p>
              <div className="grid gap-2 mb-2 max-h-32 overflow-y-auto">
                {(selected.notes || []).map((note, i) => (
                  <div key={i} className="rounded-input bg-workspace px-3 py-2 text-sm">
                    <p>{note.text}</p>
                    <p className="text-xs text-muted mt-1">{note.at}</p>
                  </div>
                ))}
                {(selected.notes || []).length === 0 && <p className="text-xs text-muted">No notes yet.</p>}
              </div>
              <div className="flex gap-2">
                <input value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="Add a note from the call..." className="input" />
                <button onClick={addNote} className="btn-outline-sm text-sm whitespace-nowrap">Add</button>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted mb-2">Action Items</p>
              <div className="grid gap-2 mb-2">
                {(selected.actionItems || []).map((item, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={item.done} onChange={() => toggleActionItem(i)} />
                    <span className={item.done ? "line-through text-muted" : ""}>{item.text}</span>
                  </label>
                ))}
                {(selected.actionItems || []).length === 0 && <p className="text-xs text-muted">No action items yet.</p>}
              </div>
              <div className="flex gap-2">
                <input value={actionDraft} onChange={(e) => setActionDraft(e.target.value)} placeholder="Create an action item..." className="input" />
                <button onClick={addActionItem} className="btn-outline-sm text-sm whitespace-nowrap">Add</button>
              </div>
            </div>

            <button
              onClick={() => patch({ followUpStatus: "Resolved" })}
              disabled={selected.followUpStatus === "Resolved"}
              className="btn-primary"
            >
              Mark as Resolved
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
