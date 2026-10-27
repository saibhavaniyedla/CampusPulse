import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useProblems } from '../../context/ProblemsContext.jsx'
import StatCard from '../../components/StatCard.jsx'
import ProblemCard from '../../components/ProblemCard.jsx'

export default function StudentHome() {
  const { user } = useAuth()
  const { problems, loading } = useProblems()

  const mine = problems.filter((p) => p.studentEmail === user.email)
  const unresolved = mine.filter((p) => p.status === 'Unresolved').length
  const inProgress = mine.filter((p) => p.status === 'In Progress').length
  const resolved = mine.filter((p) => p.status === 'Resolved').length
  const recent = mine.slice(0, 3)

  return (
    <div className="cf-section-tight">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <span className="cf-eyebrow">Student dashboard</span>
            <h1 className="h3 mt-1 mb-0">Welcome, {user.name}!</h1>
          </div>
          <Link to="/student/report" className="btn btn-cf-amber">
            <i className="bi bi-plus-circle me-2"></i>Report a Problem
          </Link>
        </div>

        <div className="row g-3 mb-5">
          <div className="col-6 col-lg-3">
            <StatCard label="Problems Reported" value={mine.length} icon="bi-clipboard-data" tone="indigo" />
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
          <h2 className="h5 mb-0">Recently reported</h2>
          <Link to="/student/problems" className="small">View all →</Link>
        </div>

        {loading && <p className="text-muted">Loading your problems…</p>}

        {!loading && recent.length === 0 && (
          <div className="cf-card p-5 text-center text-muted">
            <i className="bi bi-clipboard-plus fs-1 d-block mb-2" style={{ color: 'var(--cf-teal)' }}></i>
            You haven't reported anything yet. Spotted a problem on campus?
            <div className="mt-3">
              <Link to="/student/report" className="btn btn-cf-indigo btn-sm">Report a Problem</Link>
            </div>
          </div>
        )}

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
