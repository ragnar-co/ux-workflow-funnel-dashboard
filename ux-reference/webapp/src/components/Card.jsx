export function Card({ className = "", children, ...props }) {
  return (
    <div className={`rounded-card border border-line bg-surface shadow-[0_10px_25px_rgba(16,24,40,0.06)] ${className}`} {...props}>
      {children}
    </div>
  );
}
