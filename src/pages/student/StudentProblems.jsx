import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useProblems } from '../../context/ProblemsContext.jsx'
import ProblemCard from '../../components/ProblemCard.jsx'

const FILTERS = ['All', 'Unresolved', 'In Progress', 'Resolved']

export default function StudentProblems() {
  const { user } = useAuth()
  const { problems, loading, error } = useProblems()
  const [filter, setFilter] = useState('All')

  const mine = problems
    .filter((p) => p.studentEmail === user.email)
    .filter((p) => filter === 'All' || p.status === filter)

  return (
    <div className="cf-section-tight">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <span className="cf-eyebrow">Your tickets</span>
            <h1 className="h3 mt-1 mb-0">My Problems</h1>
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

        {!loading && mine.length === 0 && (
          <div className="cf-card p-5 text-center text-muted">
            No problems match this filter yet.
          </div>
        )}

        <div className="row g-4">
          {mine.map((p) => (
            <div className="col-md-6 col-lg-4" key={p.id}>
              <ProblemCard problem={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
