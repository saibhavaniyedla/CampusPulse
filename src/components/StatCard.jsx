export default function StatCard({ label, value, icon, tone = 'indigo' }) {
  const tones = {
    indigo: { bg: 'color-mix(in srgb, var(--cf-indigo) 14%, transparent)', color: 'var(--cf-indigo)' },
    rose: { bg: 'rgba(224, 97, 111, 0.12)', color: 'var(--cf-rose)' },
    amber: { bg: 'rgba(242, 165, 65, 0.16)', color: 'var(--cf-amber-deep)' },
    teal: { bg: 'rgba(47, 158, 143, 0.14)', color: 'var(--cf-teal-deep)' },
  }
  const t = tones[tone] || tones.indigo

  return (
    <div className="cf-stat-card d-flex align-items-center gap-3 h-100">
      <div className="cf-stat-icon" style={{ background: t.bg, color: t.color }}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <div className="cf-stat-value">{value}</div>
        <div className="cf-stat-label">{label}</div>
      </div>
    </div>
  )
}
