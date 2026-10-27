
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')

   if (form.password.length < 8) {
  setMessage('Password must contain at least 8 characters.')
  return
}

    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const result = await register(
        form.name,
        form.email,
        form.password
      )

      if (!result.success) {
        setMessage(result.error)
        return
      }

      navigate('/login', {
        state: {
          message: 'Registration successful! Please log in.',
        },
      })
    } catch {
      setMessage('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cf-register-wrap py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="cf-card p-4 p-md-5">
              <div className="text-center mb-4">
                <i
                  className="bi bi-person-plus fs-1"
                  style={{ color: 'var(--cf-teal)' }}
                ></i>
                <h1 className="h3 mt-2 mb-1">
                  Create your CampusPulse account
                </h1>
                <p className="text-muted small mb-0">
                  Register to get started.
                </p>
              </div>

              {message && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label small fw-semibold">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label small fw-semibold">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label small fw-semibold">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label small fw-semibold"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-cf-amber w-100 py-2 mt-2"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Create account'}
                </button>
              </form>

              <p className="text-center small text-muted mt-4 mb-0">
                Already registered? <Link to="/login">Login here</Link>
              </p>

              <div className="cf-perforation my-4"></div>

              <p className="text-center small mb-0">
                <Link to="/">← Back to home</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
