/** Моно-лейбл секции в стиле «(02) — Услуги». */
export default function SectionLabel({ index, label, className = '' }) {
  return (
    <div
      className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/50 ${className}`}
    >
      <span className="text-acid">({index})</span>
      <span className="h-px w-8 bg-white/20" />
      <span>{label}</span>
    </div>
  );
}
