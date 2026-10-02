import { MemberRow } from "./MemberRow.jsx";

export function MemberTable({ members, onRemove, showTeam = false, emptyLabel = "No members yet" }) {
  if (members.length === 0) {
    return <p className="text-sm text-muted py-3">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
            <th className="pb-2 pr-3 font-extrabold">Name</th>
            {showTeam && <th className="pb-2 pr-3 font-extrabold">Team</th>}
            <th className="pb-2 pr-3 font-extrabold">Role</th>
            <th className="pb-2 pr-3 font-extrabold">Email</th>
            <th className="pb-2 pr-3 font-extrabold">Status</th>
            <th className="pb-2 font-extrabold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((person) => (
            <MemberRow key={person.id} person={person} onRemove={onRemove} showTeam={showTeam} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
