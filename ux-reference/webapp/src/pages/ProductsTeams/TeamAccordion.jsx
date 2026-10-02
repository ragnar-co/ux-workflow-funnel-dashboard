import { useState } from "react";
import { MemberTable } from "./MemberTable.jsx";

export function TeamAccordion({ team, lead, members, expanded, onToggle, onAddPerson, onRemovePerson, onEditTeam }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeCount = members.filter((m) => (m.status || "Active") === "Active").length;

  return (
    <div className="border-b border-line last:border-b-0">
      <div className="flex items-center gap-3 py-3">
        <button onClick={onToggle} className="flex items-center gap-2 flex-1 min-w-0 text-left">
          <span className="text-muted text-xs w-3">{expanded ? "▼" : "▶"}</span>
          <strong className="text-sm">{team}</strong>
          {lead && <span className="text-xs text-muted">· Lead: {lead}</span>}
          <span className="text-xs text-muted ml-auto mr-2 whitespace-nowrap">{members.length} people · {activeCount} active</span>
        </button>
        <div className="relative shrink-0">
          <button onClick={() => setMenuOpen((v) => !v)} className="text-muted hover:text-ink px-1.5 text-sm">•••</button>
          {menuOpen && (
            <div className="absolute right-0 top-6 z-10 w-32 rounded-input border border-line bg-surface shadow-[0_10px_25px_rgba(16,24,40,0.1)]">
              <button
                onClick={() => { setMenuOpen(false); onEditTeam(); }}
                className="w-full px-3 py-2 text-left text-xs font-semibold hover:bg-workspace"
              >
                Edit Team
              </button>
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="pl-5 pb-4">
          <MemberTable members={members} onRemove={onRemovePerson} />
          <button onClick={onAddPerson} className="mt-2 text-xs font-bold text-brand-blue hover:underline">
            + Add Person
          </button>
        </div>
      )}
    </div>
  );
}
