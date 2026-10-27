import StatusBadge from './StatusBadge.jsx'

const CATEGORY_ICONS = {
  Electrical: 'bi-lightning-charge',
  Plumbing: 'bi-droplet',
  Furniture: 'bi-lamp',
  Cleanliness: 'bi-trash',
  Infrastructure: 'bi-door-closed',
  Other: 'bi-question-circle',
}

export default function ProblemCard({ problem, footer }) {
  const icon = CATEGORY_ICONS[problem.category] || CATEGORY_ICONS.Other

  return (
    <div className="cf-ticket h-100">
      <div className="cf-ticket-body d-flex flex-column h-100">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="cf-ticket-id">#CF-{String(problem.id).padStart(4, '0')}</span>
          <StatusBadge status={problem.status} />
        </div>

        {problem.image && (
          <img src={problem.image} alt={problem.title} className="cf-thumb mb-3" />
        )}

        <h3 className="h6 mb-1">{problem.title}</h3>
        <p className="text-muted small mb-2" style={{ minHeight: '2.6em' }}>
          {problem.description}
        </p>

        <div className="d-flex flex-wrap gap-3 small text-muted mb-2">
          <span><i className={`bi ${icon} me-1`}></i>{problem.category}</span>
          <span><i className="bi bi-geo-alt me-1"></i>{problem.location}</span>
        </div>

        <div className="d-flex justify-content-between align-items-center small text-muted mt-auto pt-2">
          <span><i className="bi bi-calendar3 me-1"></i>{problem.date}</span>
          {problem.studentName && <span>{problem.studentName}</span>}
        </div>

        {footer && <div className="mt-3">{footer}</div>}
      </div>
    </div>
  )
}
