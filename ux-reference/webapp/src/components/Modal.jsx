export function Modal({ open, onClose, title, children, maxWidth = "max-w-3xl" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} max-h-[85vh] bg-surface rounded-card border border-line shadow-[0_20px_50px_rgba(16,24,40,0.2)] flex flex-col`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
          <h2 className="text-base font-bold">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-ink text-xl leading-none">×</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
