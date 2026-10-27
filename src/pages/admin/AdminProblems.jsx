import { useState } from 'react'
import { useProblems } from '../../context/ProblemsContext.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'

const STATUSES = ['Unresolved', 'In Progress', 'Resolved']
const FILTERS = ['All', ...STATUSES]

export default function AdminProblems() {
  const { problems, loading, error, updateStatus } = useProblems()
  const [filter, setFilter] = useState('All')

  const filtered = problems.filter((p) => filter === 'All' || p.status === filter)

  return (
    <div className="cf-section-tight">
      <div className="container-fluid px-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <span className="cf-eyebrow">Manage tickets</span>
            <h1 className="h3 mt-1 mb-0">All Problems</h1>
          </div>

          <div className="btn-group">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`btn btn-sm ${filter === f ? 'btn-cf-indigo' : 'btn-cf-outline'}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-muted">Loading…</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && filtered.length === 0 && (
          <div className="cf-card p-5 text-center text-muted">No problems match this filter.</div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="cf-card p-0" style={{ overflowX: 'auto' }}>
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-muted small text-uppercase">
                  <th className="ps-4">Ticket</th>
                  <th>Student</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="pe-4">Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                        {p.image ? (
                          <img src={p.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }} />
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{ width: 40, height: 40, borderRadius: 8, background: '#f1f2f7' }}
                          >
                            <i className="bi bi-image text-muted"></i>
                          </div>
                        )}
                        <div>
                          <div className="fw-semibold small">{p.title}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem', maxWidth: 260 }}>
                            {p.description}
                          </div>
                          <div className="cf-ticket-id">#CF-{String(p.id).padStart(4, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="small">{p.studentName}</td>
                    <td className="small">{p.category}</td>
                    <td className="small">{p.location}</td>
                    <td className="small text-nowrap">{p.date}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td className="pe-4">
                      <select
                        className="form-select form-select-sm"
                        value={p.status}
                        onChange={(e) => updateStatus(p.id, e.target.value)}
                        style={{ minWidth: 140 }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
