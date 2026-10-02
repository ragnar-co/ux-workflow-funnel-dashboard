import { useLocation } from "react-router-dom";
import { useAppState } from "../store/AppStateContext.jsx";
import { ROLES } from "../config/roles.js";
import { PAGE_META } from "../config/pageMeta.js";
import { FilterSelect } from "../components/FilterSelect.jsx";

export function Topbar() {
  const location = useLocation();
  const { role, setRole, responses } = useAppState();
  const [title, subtitle] = PAGE_META[location.pathname] || PAGE_META["/"];

  return (
    <header className="flex items-start justify-between gap-6 mb-6">
      <div>
        <h1 className="text-2xl font-bold leading-tight mb-1">{title}</h1>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted">
          View as
          <FilterSelect icon="owner" value={role} onChange={setRole} options={ROLES.map((item) => ({ value: item.id, label: item.label }))} />
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-muted">
          <span className="h-2 w-2 rounded-full bg-brand-green" />
          {responses.length} responses synced
        </div>
      </div>
    </header>
  );
}
