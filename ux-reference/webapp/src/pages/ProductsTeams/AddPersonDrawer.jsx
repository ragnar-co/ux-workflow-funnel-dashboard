import { useState, useEffect } from "react";
import { Drawer } from "../../components/Drawer.jsx";
import { FormSelect } from "../../components/FormSelect.jsx";

export function AddPersonDrawer({ open, onClose, onSubmit, teams, defaultTeam }) {
  const [form, setForm] = useState({ name: "", email: "", role: "", team: defaultTeam || teams[0] || "", status: "Active" });

  useEffect(() => {
    if (open) setForm({ name: "", email: "", role: "", team: defaultTeam || teams[0] || "", status: "Active" });
  }, [open, defaultTeam, teams]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const canSubmit = form.name.trim() && form.team;

  return (
    <Drawer open={open} onClose={onClose} title="Add Person">
      <div className="grid gap-4">
        <Field label="Name *">
          <input value={form.name} onChange={set("name")} placeholder="e.g. คุณ สมชาย" className="input" />
        </Field>
        <Field label="Email">
          <input value={form.email} onChange={set("email")} placeholder="e.g. somchai@ragnar.co.th" className="input" />
        </Field>
        <Field label="Role / Position">
          <input value={form.role} onChange={set("role")} placeholder="e.g. CTM Lead" className="input" />
        </Field>
        <Field label="Team">
          <FormSelect icon="team" value={form.team} onChange={set("team")} options={teams.map((t) => ({ value: t, label: t }))} />
        </Field>
        <Field label="Status">
          <FormSelect
            icon="status"
            value={form.status}
            onChange={set("status")}
            options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]}
          />
        </Field>
      </div>
      <div className="flex items-center gap-3 mt-6">
        <button onClick={onClose} className="btn-secondary">Cancel</button>
        <button
          disabled={!canSubmit}
          onClick={() => { onSubmit(form); onClose(); }}
          className="btn-primary ml-auto"
        >
          Add Person
        </button>
      </div>
    </Drawer>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-muted">
      {label}
      {children}
    </label>
  );
}
