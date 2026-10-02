import { useState, useEffect } from "react";
import { Drawer } from "../../components/Drawer.jsx";
import { FormSelect } from "../../components/FormSelect.jsx";

export function AddTeamDrawer({ open, onClose, onSubmit, productName, initial }) {
  const [form, setForm] = useState({ name: "", lead: "", status: "Active" });

  useEffect(() => {
    if (open) setForm({ name: initial?.name || "", lead: initial?.lead || "", status: initial?.status || "Active" });
  }, [open, initial]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const canSubmit = form.name.trim();

  return (
    <Drawer open={open} onClose={onClose} title={initial ? "Edit Team" : "Add Team"}>
      <div className="grid gap-4">
        <Field label="Product">
          <input value={productName} disabled className="input" />
        </Field>
        <Field label="Team Name *">
          <input value={form.name} onChange={set("name")} disabled={!!initial} placeholder="e.g. CTM" className="input" />
        </Field>
        <Field label="Team Lead">
          <input value={form.lead} onChange={set("lead")} placeholder="e.g. คุณ สมชาย" className="input" />
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
          {initial ? "Save Changes" : "Add Team"}
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
