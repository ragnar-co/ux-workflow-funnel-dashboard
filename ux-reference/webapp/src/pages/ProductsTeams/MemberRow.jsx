import { StatusChip } from "../../components/StatusPill.jsx";

function getInitial(name) {
  const clean = name.replace(/\(.*?\)/g, "").trim();
  const parts = clean.split(/\s+/).filter((p) => p && p !== "คุณ");
  return (parts[0] || clean).slice(0, 1).toUpperCase();
}

export function MemberRow({ person, onRemove, showTeam = false }) {
  return (
    <tr className="border-t border-line">
      <td className="py-2 pr-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-blue-soft text-xs font-bold text-brand-blue">
            {getInitial(person.name)}
          </span>
          <span className="text-sm truncate">{person.name}</span>
        </div>
      </td>
      {showTeam && <td className="py-2 pr-3 text-sm text-muted whitespace-nowrap">{person.team}</td>}
      <td className="py-2 pr-3 text-sm text-muted whitespace-nowrap">{person.role || "—"}</td>
      <td className="py-2 pr-3 text-sm text-muted whitespace-nowrap">{person.email || "—"}</td>
      <td className="py-2 pr-3"><StatusChip status={person.status || "Active"} /></td>
      <td className="py-2 text-right">
        <button onClick={() => onRemove(person.id)} className="text-xs font-bold text-muted hover:text-brand-blue">Remove</button>
      </td>
    </tr>
  );
}
