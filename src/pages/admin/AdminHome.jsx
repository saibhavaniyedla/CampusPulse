import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useProblems } from '../../context/ProblemsContext.jsx'
import StatCard from '../../components/StatCard.jsx'
import ProblemCard from '../../components/ProblemCard.jsx'

export default function AdminHome() {
  const { user } = useAuth()
  const { problems, loading } = useProblems()

  const unresolved = problems.filter((p) => p.status === 'Unresolved').length
  const inProgress = problems.filter((p) => p.status === 'In Progress').length
  const resolved = problems.filter((p) => p.status === 'Resolved').length
  const recent = problems.slice(0, 6)

  return (
    <div className="cf-section-tight">
      <div className="container">
        <div className="mb-4">
          <span className="cf-eyebrow">Admin dashboard</span>
          <h1 className="h3 mt-1 mb-0">Welcome, {user.name}!</h1>
        </div>

        <div className="row g-3 mb-5">
          <div className="col-6 col-lg-3">
            <StatCard label="Total Problems" value={problems.length} icon="bi-clipboard-data" tone="indigo" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Unresolved" value={unresolved} icon="bi-exclamation-circle" tone="rose" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="In Progress" value={inProgress} icon="bi-tools" tone="amber" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Resolved" value={resolved} icon="bi-check-circle" tone="teal" />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Recent Problems</h2>
          <Link to="/admin/problems" className="small">Manage all →</Link>
        </div>

        {loading && <p className="text-muted">Loading…</p>}

        <div className="row g-4">
          {recent.map((p) => (
            <div className="col-md-4" key={p.id}>
              <ProblemCard problem={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
