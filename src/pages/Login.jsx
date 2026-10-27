import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fillDemo = (r) => {
    setRole(r)
    setEmail(DEMO_ACCOUNTS[r].email)
    setPassword(DEMO_ACCOUNTS[r].password)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(email.trim().toLowerCase(), password, role)

      if (!result.success) {
        setError(result.error || 'Invalid email or password. Please try again.')
        return
      }

      navigate(result.role === 'admin' ? '/admin' : '/student')
    } catch {
      setError('Unable to connect to the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cf-login-wrap py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="cf-card p-4 p-md-5">
              <div className="text-center mb-4">
                <i
                  className="bi bi-wrench-adjustable-circle fs-1"
                  style={{ color: 'var(--cf-teal)' }}
                />
                <h1 className="h3 mt-2 mb-1">Welcome back</h1>
                <p className="text-muted small mb-0">
                  Log in to report or manage campus problems.
                </p>
              </div>

              <div className="cf-role-toggle btn-group w-100 mb-4" role="group">
                <button
                  type="button"
                  className={`btn ${role === 'student' ? 'btn-cf-indigo' : 'btn-cf-outline'}`}
                  onClick={() => {
                    setRole('student')
                    setError('')
                  }}
                >
                  <i className="bi bi-mortarboard me-1" />
                  Student
                </button>

                <button
                  type="button"
                  className={`btn ${role === 'admin' ? 'btn-cf-indigo' : 'btn-cf-outline'}`}
                  onClick={() => {
                    setRole('admin')
                    setError('')
                  }}
                >
                  <i className="bi bi-shield-check me-1" />
                  Admin
                </button>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="login-email" className="form-label small fw-semibold">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="login-password" className="form-label small fw-semibold">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-cf-amber w-100 py-2 mt-2"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : `Log in as ${role === 'admin' ? 'Admin' : 'Student'}`}
                </button>
              </form>

              <div className="text-center small mt-3">
                {role === 'student' ? (
                  <>
                    Don't have a student account?{' '}
                    <Link to="/register">Register here</Link>
                  </>
                ) : (
                  <>
                    Lecturer needs an account?{' '}
                    <Link to="/admin/register">Admin registration</Link>
                  </>
                )}
              </div>

              <div className="cf-perforation my-4" />

              <div className="small text-muted">
                <p className="fw-semibold mb-2">Demo credentials</p>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Student: {DEMO_ACCOUNTS.student.email}</span>
                  <button type="button" className="btn btn-sm btn-cf-outline" onClick={() => fillDemo('student')}>
                    Use
                  </button>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span>Admin: {DEMO_ACCOUNTS.admin.email}</span>
                  <button type="button" className="btn btn-sm btn-cf-outline" onClick={() => fillDemo('admin')}>
                    Use
                  </button>
                </div>
              </div>

              <p className="text-center small text-muted mt-4 mb-0">
                <Link to="/">← Back to home</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}