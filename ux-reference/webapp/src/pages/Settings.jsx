import { useEffect, useState } from "react";
import { useAppState } from "../store/AppStateContext.jsx";
import { ROLES, ROLE_NAV_ACCESS } from "../config/roles.js";
import { Card } from "../components/Card.jsx";
import { FormSelect } from "../components/FormSelect.jsx";

export function Settings() {
  const { role, setRole, appConfig, products, clearAllData } = useAppState();
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleClearData = () => {
    if (!window.confirm("Clear all survey datasets, responses, and events? This can't be undone.")) return;
    clearAllData();
    setToast("All data cleared");
  };

  return (
    <div className="grid gap-4 max-w-3xl">
      <Card className="p-5">
        <h2 className="text-base font-bold mb-1">Your Role</h2>
        <p className="text-sm text-muted mb-3">Controls which pages appear in the sidebar for this session.</p>
        <FormSelect icon="owner" value={role} onChange={(e) => setRole(e.target.value)} options={ROLES.map((r) => ({ value: r.id, label: r.label }))} className="max-w-xs" />
        <p className="text-xs text-muted mt-2">Accessible pages: {ROLE_NAV_ACCESS[role].join(", ")}</p>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-bold mb-3">Products & Teams (from config)</h2>
        <div className="grid gap-2">
          {products.map((p) => (
            <div key={p.name} className="flex items-center justify-between rounded-input bg-workspace px-3 py-2 text-sm">
              <strong>{p.name}</strong>
              <span className="text-muted">{p.teams.join(", ") || "no teams yet"}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3">
          Edit <code className="rounded bg-workspace px-1.5 py-0.5">src/config/app-config.json</code> to permanently change products,
          teams, sources, or navigation labels without touching code.
        </p>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-bold mb-3">Sources & Case Statuses</h2>
        <p className="text-sm text-muted mb-2">Sources: {appConfig.sources.map((s) => s.label).join(", ")}</p>
        <p className="text-sm text-muted">Case statuses: {appConfig.caseStatuses.join(", ")}</p>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-bold mb-2">Font</h2>
        <p className="text-sm text-muted">
          Production font is LINE Seed Sans Thai. Drop the licensed <code className="rounded bg-workspace px-1.5 py-0.5">.woff2</code> files
          into <code className="rounded bg-workspace px-1.5 py-0.5">public/fonts/</code> — the app falls back to Inter / Noto Sans Thai until then.
        </p>
      </Card>

      <Card className="p-5 border-ragnar-red/30">
        <h2 className="text-base font-bold mb-1">Danger Zone</h2>
        <p className="text-sm text-muted mb-3">
          Permanently remove every survey dataset, response, and event from this workspace, including anything saved in your browser.
        </p>
        <button
          onClick={handleClearData}
          className="inline-flex items-center gap-1.5 rounded-input border border-ragnar-red text-ragnar-red px-3 py-2 text-xs font-bold transition-colors hover:bg-ragnar-red/5"
        >
          Clear All Data
        </button>
      </Card>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-input bg-ink text-white text-sm font-semibold px-4 py-3 shadow-[0_10px_25px_rgba(16,24,40,0.2)]">
          {toast}
        </div>
      )}
    </div>
  );
}
