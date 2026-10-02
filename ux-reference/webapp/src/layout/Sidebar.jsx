import { NavLink } from "react-router-dom";
import { useAppState } from "../store/AppStateContext.jsx";
import { ROLE_NAV_ACCESS } from "../config/roles.js";
import { NavIcon } from "./NavIcon.jsx";
import { SIDEBAR_EXPANDED_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from "./sidebarWidths.js";

function groupItems(items) {
  const groups = [];
  const byName = new Map();
  items.forEach((item) => {
    const name = item.group || "General";
    if (!byName.has(name)) {
      byName.set(name, { name, items: [] });
      groups.push(byName.get(name));
    }
    byName.get(name).items.push(item);
  });
  return groups;
}

export function Sidebar() {
  const { appConfig, role, sidebarCollapsed, setSidebarCollapsed } = useAppState();
  const allowed = ROLE_NAV_ACCESS[role] || [];
  const items = appConfig.navigation.filter((item) => allowed.includes(item.id));
  const groups = groupItems(items);
  const width = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <aside
      style={{ width }}
      className="fixed inset-y-0 left-0 border-r border-line bg-surface px-3 py-6 flex flex-col gap-6 transition-[width] duration-200 overflow-hidden"
    >
      <div className={`flex px-1 ${sidebarCollapsed ? "flex-col items-center gap-2" : "items-center justify-between gap-2"}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-ragnar-red font-extrabold text-white">R</div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight truncate">Ragnar NPS</p>
              <p className="text-xs text-muted leading-tight truncate">Operation Center</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-brand-blue text-white hover:brightness-95"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-3.5 w-3.5 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`}>
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-col gap-4 overflow-y-auto">
        {groups.map((group) => (
          <div key={group.name} className="flex flex-col gap-1">
            {!sidebarCollapsed && (
              <p className="px-3 mb-0.5 text-[10px] font-extrabold uppercase tracking-wider text-muted/70">{group.name}</p>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.id}
                to={item.id === "dashboard" ? "/" : `/${item.id}`}
                title={sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${sidebarCollapsed ? "justify-center px-0" : ""} ${
                    isActive ? "bg-brand-blue-soft text-brand-blue font-bold" : "text-muted hover:bg-workspace hover:text-ink"
                  }`
                }
              >
                <NavIcon id={item.id} className="h-4.5 w-4.5 shrink-0" />
                {!sidebarCollapsed && item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
