import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ToolbarIcon } from "./ToolbarIcon.jsx";

const MENU_WIDTH = 200;
const TOOLTIP_MAX_WIDTH = 260;
const TOOLTIP_GAP = 8;

export function Spinner() {
  return (
    <span
      className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-line"
      style={{ borderTopColor: "#334155" }}
    />
  );
}

export function OptionTooltip({ anchorEl, text }) {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.right;
    if (spaceRight >= TOOLTIP_MAX_WIDTH + TOOLTIP_GAP) {
      setCoords({ placement: "right", top: rect.top + rect.height / 2, left: rect.right + TOOLTIP_GAP });
    } else {
      setCoords({ placement: "bottom", top: rect.bottom + TOOLTIP_GAP, left: rect.left });
    }
  }, [anchorEl]);

  if (!coords || !text) return null;

  return createPortal(
    <div
      role="tooltip"
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        transform: coords.placement === "right" ? "translateY(-50%)" : undefined,
        maxWidth: TOOLTIP_MAX_WIDTH,
        background: "#1F2937",
        color: "#fff",
        fontSize: 12.5,
        lineHeight: 1.4,
        borderRadius: 8,
        padding: "8px 10px"
      }}
      className="pointer-events-none z-[60] shadow-[0_8px_20px_rgba(15,23,42,0.25)]"
    >
      {text}
    </div>,
    document.body
  );
}

function OptionRow({ opt, isLoading, disabledAll, isTooltipActive, onHoverChange, onSelect }) {
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
        className="flex h-10 w-full items-center gap-2 px-3 text-left text-[#94A3B8] transition-colors hover:bg-[#F8FAFC] hover:text-[#334155] focus:bg-[#F8FAFC] focus:text-[#334155] focus:outline-none disabled:cursor-wait"
      >
        {isLoading ? <Spinner /> : <ToolbarIcon id={opt.icon} className="h-4 w-4 shrink-0" />}
        <span className="text-sm font-medium">{opt.label}</span>
      </button>
      {isTooltipActive && !isLoading && opt.description && <OptionTooltip anchorEl={btnRef.current} text={opt.description} />}
    </>
  );
}

export function ExportMenu({ label = "Export", options, disabled = false, disabledReason }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [loadingKey, setLoadingKey] = useState(null);
  const [activeTooltipKey, setActiveTooltipKey] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const handleHoverChange = (key, active) => {
    setActiveTooltipKey((prev) => (active ? key : (prev === key ? null : prev)));
  };

  const toggle = () => {
    if (disabled) return;
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: Math.min(rect.left, window.innerWidth - MENU_WIDTH - 8) });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = async (opt) => {
    if (loadingKey) return;
    setLoadingKey(opt.key);
    try {
      await Promise.resolve(opt.onSelect());
    } finally {
      setLoadingKey(null);
      setActiveTooltipKey(null);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        disabled={disabled}
        title={disabled ? disabledReason : undefined}
        className="inline-flex h-9 items-center gap-1.5 rounded-input border border-line bg-surface px-3 text-xs font-bold text-ink transition-colors hover:bg-workspace disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-surface"
      >
        <ToolbarIcon id="download" className="h-3.5 w-3.5" />
        {label}
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: coords.top, left: coords.left, width: MENU_WIDTH }}
          className="z-50 rounded-[12px] border border-[#E2E8F0] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)] py-1.5"
        >
          {options.map((opt) => (
            <OptionRow
              key={opt.key}
              opt={opt}
              isLoading={loadingKey === opt.key}
              disabledAll={Boolean(loadingKey)}
              isTooltipActive={activeTooltipKey === opt.key}
              onHoverChange={handleHoverChange}
              onSelect={handleSelect}
            />
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
