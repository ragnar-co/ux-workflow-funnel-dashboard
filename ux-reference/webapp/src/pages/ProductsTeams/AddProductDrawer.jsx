import { useState, useEffect } from "react";
import { Drawer } from "../../components/Drawer.jsx";
import { FormSelect } from "../../components/FormSelect.jsx";

export function AddProductDrawer({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({ name: "", owner: "", status: "Active" });

  useEffect(() => {
    if (open) setForm({ name: initial?.name || "", owner: initial?.owner || "", status: initial?.status || "Active" });
  }, [open, initial]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const canSubmit = form.name.trim();

  return (
    <Drawer open={open} onClose={onClose} title={initial ? "Edit Product" : "Add Product"}>
      <div className="grid gap-4">
        <Field label="Product Name *">
          <input value={form.name} onChange={set("name")} disabled={!!initial} placeholder="e.g. t-reg" className="input" />
        </Field>
        <Field label="Product Owner">
          <input value={form.owner} onChange={set("owner")} placeholder="e.g. Numnim" className="input" />
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
          {initial ? "Save Changes" : "Add Product"}
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
