import { Outlet } from "react-router-dom";
import { useAppState } from "../store/AppStateContext.jsx";
import { Sidebar } from "./Sidebar.jsx";
import { Topbar } from "./Topbar.jsx";
import { SIDEBAR_EXPANDED_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from "./sidebarWidths.js";

export function AppLayout() {
  const { sidebarCollapsed } = useAppState();
  const marginLeft = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;

  return (
    <div className="min-h-screen bg-workspace">
      <Sidebar />
      <div style={{ marginLeft }} className="px-8 py-8 transition-[margin-left] duration-200">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
}
