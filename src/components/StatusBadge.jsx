const STATUS_MAP = {
  Unresolved: { className: 'cf-badge-unresolved', icon: 'bi-exclamation-circle' },
  'In Progress': { className: 'cf-badge-inprogress', icon: 'bi-tools' },
  Resolved: { className: 'cf-badge-resolved', icon: 'bi-check-circle' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || STATUS_MAP.Unresolved
  return (
    <span className={`cf-badge ${config.className}`}>
      <i className={`bi ${config.icon}`}></i>
      {status}
    </span>
  )
}
