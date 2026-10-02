import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DatasetStatusChip } from "../../components/StatusPill.jsx";
import { SortableTh } from "../../components/SortableTh.jsx";
import { ColumnFilterMenu } from "../../components/ColumnFilterMenu.jsx";
import { ToolbarIcon } from "../../components/ToolbarIcon.jsx";
import { Spinner, OptionTooltip } from "../../components/ExportMenu.jsx";
import { getSurveyTypeLabel, getSurveyTypeFullLabel, getDatasetPeriod, getDatasetNpsScore } from "../../domain/surveys.js";
import { signed } from "../../domain/nps.js";

const MENU_WIDTH = 200;
const SUBMENU_WIDTH = 240;
const SUBMENU_GAP = 6;

// Short badge labels for the Type column specifically — the full label (shown on hover)
// is still used everywhere else (exports, Dashboard) so those stay unambiguous.
const TYPE_BADGE_LABEL = { event: "Event", satisfaction: "Customer Sat" };

const DOWNLOAD_OPTIONS = [
  { key: "pdf", icon: "fileText", label: "PDF Report", format: "pdf", description: "รายงานสรุปพร้อม Analysis และ Insight" },
  { key: "csv", icon: "table", label: "CSV Data", format: "csv", description: "ข้อมูลดิบสำหรับ Excel หรือระบบอื่น" },
  { key: "md", icon: "fileCode", label: "Markdown", format: "md", description: "รายงานข้อความสำหรับ Claude, Notion หรือเอกสารภายใน" }
];

function DownloadSubmenuRow({ opt, isLoading, disabledAll, isTooltipActive, onHoverChange, onSelect }) {
  const btnRef = useRef(null);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => onSelect(opt)}
        disabled={disabledAll}
        onMouseEnter={() => onHoverChange(opt.key, true)}
        onMouseLeave={() => onHoverChange(opt.key, false)}
        onFocus={() => onHoverChange(opt.key, true)}
        onBlur={() => onHoverChange(opt.key, false)}
        className="flex h-11 w-full items-center gap-2 px-3 text-left text-[#94A3B8] transition-colors hover:bg-[#F8FAFC] hover:text-[#334155] focus:bg-[#F8FAFC] focus:text-[#334155] focus:outline-none disabled:cursor-wait"
      >
        {isLoading ? <Spinner /> : <ToolbarIcon id={opt.icon} className="h-4 w-4 shrink-0" />}
        <span className="text-sm font-medium">{opt.label}</span>
      </button>
      {isTooltipActive && !isLoading && opt.description && <OptionTooltip anchorEl={btnRef.current} text={opt.description} />}
    </>
  );
}

function RowActionsMenu({ onExport, onDelete }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [submenuCoords, setSubmenuCoords] = useState(null);
  const [loadingKey, setLoadingKey] = useState(null);
  const [activeTooltipKey, setActiveTooltipKey] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const downloadRef = useRef(null);
  const submenuRef = useRef(null);
  const closeTimerRef = useRef(null);

  const handleHoverChange = (key, active) => {
    setActiveTooltipKey((prev) => (active ? key : (prev === key ? null : prev)));
  };

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8) });
    }
    setOpen((v) => !v);
    setSubmenuOpen(false);
  };

  useEffect(() => {
    if (!open) { setSubmenuOpen(false); return; }
    const handler = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        (!submenuRef.current || !submenuRef.current.contains(e.target)) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const escHandler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", escHandler);
    };
  }, [open]);

  const openSubmenu = () => {
    clearTimeout(closeTimerRef.current);
    if (!downloadRef.current) return;
    const rect = downloadRef.current.getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.right;
    if (spaceRight >= SUBMENU_WIDTH + SUBMENU_GAP) {
      setSubmenuCoords({ top: rect.top, left: rect.right + SUBMENU_GAP });
    } else {
      setSubmenuCoords({ top: rect.top, left: rect.left - SUBMENU_WIDTH - SUBMENU_GAP });
    }
    setSubmenuOpen(true);
  };

  const scheduleSubmenuClose = () => {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setSubmenuOpen(false), 150);
  };

  const handleExport = async (opt) => {
    if (loadingKey) return;
    setLoadingKey(opt.key);
    try {
      await Promise.resolve(onExport(opt.format));
    } finally {
      setLoadingKey(null);
      setActiveTooltipKey(null);
      setOpen(false);
      setSubmenuOpen(false);
    }
  };

  return (
    <>
      <button ref={btnRef} onClick={toggle} title="More actions" className="text-muted hover:text-ink px-1">•••</button>
      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: MENU_WIDTH }}
          className="z-50 rounded-[12px] border border-[#E2E8F0] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)] py-1.5 text-left"
          onMouseLeave={scheduleSubmenuClose}
        >
          <button
            ref={downloadRef}
            onClick={openSubmenu}
            onMouseEnter={openSubmenu}
            className="flex h-11 w-full items-center gap-2 px-3 text-left text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#334155]"
          >
            <ToolbarIcon id="download" className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-sm font-medium">Download</span>
            <ToolbarIcon id="chevronRight" className="h-3.5 w-3.5 shrink-0" />
          </button>
          <div className="my-1 border-t border-line" />
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            className="flex h-11 w-full items-center gap-2 px-3 text-left text-[#F87171] transition-colors hover:bg-ragnar-red/5 hover:text-[#EF4444]"
          >
            <ToolbarIcon id="trash" className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>,
        document.body
      )}
      {open && submenuOpen && submenuCoords && createPortal(
        <div
          ref={submenuRef}
          style={{ position: "fixed", top: submenuCoords.top, left: submenuCoords.left, width: SUBMENU_WIDTH }}
          className="z-50 rounded-[12px] border border-[#E2E8F0] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)] py-1.5"
          onMouseEnter={() => clearTimeout(closeTimerRef.current)}
          onMouseLeave={scheduleSubmenuClose}
        >
          {DOWNLOAD_OPTIONS.map((opt) => (
            <DownloadSubmenuRow
              key={opt.key}
              opt={opt}
              isLoading={loadingKey === opt.key}
              disabledAll={Boolean(loadingKey)}
              isTooltipActive={activeTooltipKey === opt.key}
              onHoverChange={handleHoverChange}
              onSelect={handleExport}
            />
          ))}
        </div>,
        document.body
      )}
    </>
  );
}

export function DatasetTable({
  datasets, responses, sort, onSort,
  typeOptions, typeFilter, onTypeFilter,
  statusOptions, statusFilter, onStatusFilter,
  onView, onDelete, onExportRow
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed text-left text-sm" style={{ minWidth: 920 }}>
        <colgroup>
          <col className="w-[24%]" />
          <col className="w-[11%]" />
          <col className="w-[15%]" />
          <col className="w-[9%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
          <col className="w-[9%]" />
          <col className="w-[5%]" />
          <col className="w-[7%]" />
        </colgroup>
        <thead className="bg-workspace">
          <tr className="text-[11px] font-extrabold uppercase tracking-wide text-muted">
            <SortableTh label="Survey Name" sortKey="datasetName" sort={sort} onSort={onSort} className="pl-4" />
            <ColumnFilterMenu label="Type" options={typeOptions} selected={typeFilter} onChange={onTypeFilter} className="pl-3" />
            <th className="py-3 pl-3 pr-3 whitespace-nowrap">Product / Event</th>
            <th className="py-3 pl-3 pr-3 whitespace-nowrap">Period</th>
            <SortableTh label="Responses" sortKey="responses" sort={sort} onSort={onSort} className="whitespace-nowrap" />
            <th className="py-3 pr-3 whitespace-nowrap">NPS Score</th>
            <ColumnFilterMenu label="Status" options={statusOptions} selected={statusFilter} onChange={onStatusFilter} align="right" className="pl-2" />
            <th className="py-3 pl-2 pr-3 text-center whitespace-nowrap">View</th>
            <th className="py-3 pl-2 pr-4 text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {datasets.map((d) => {
            const nps = getDatasetNpsScore(d, responses);
            return (
              <tr key={d.id} className="border-t border-line hover:bg-workspace/60">
                <td className="py-6 pl-4 pr-3 truncate font-semibold">{d.datasetName}</td>
                <td className="py-6 pr-3">
                  <span
                    title={getSurveyTypeFullLabel(d.type)}
                    className="inline-flex h-[27px] max-w-full items-center truncate rounded-full bg-workspace px-2.5 text-xs font-bold text-ink"
                  >
                    {TYPE_BADGE_LABEL[d.type] || getSurveyTypeLabel(d.type)}
                  </span>
                </td>
                <td className="py-6 pl-3 pr-3 truncate" style={{ color: "#334155" }}>{d.product}</td>
                <td className="py-6 pl-3 pr-3 truncate text-muted">{getDatasetPeriod(d)}</td>
                <td className="py-6 pr-3 whitespace-nowrap">{d.responses}</td>
                <td className="py-6 pr-3 whitespace-nowrap">
                  {nps == null ? <span className="text-muted">—</span> : (
                    <strong className={nps < 30 ? "text-ragnar-red" : "text-brand-green"}>{signed(nps)}</strong>
                  )}
                </td>
                <td className="py-6 pr-3"><DatasetStatusChip status={d.status} /></td>
                <td className="py-6 pl-2 pr-3 text-center whitespace-nowrap">
                  <button onClick={() => onView(d)} title="View report" className="inline-flex items-center justify-center text-muted hover:text-brand-blue transition-colors">
                    <ToolbarIcon id="search" className="h-4 w-4" />
                  </button>
                </td>
                <td className="py-6 pl-2 pr-4 text-center whitespace-nowrap">
                  <RowActionsMenu onExport={(format) => onExportRow(d, format)} onDelete={() => onDelete(d)} />
                </td>
              </tr>
            );
          })}
          {datasets.length === 0 && (
            <tr><td colSpan={9} className="py-8 text-center text-muted">No surveys match your search.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
