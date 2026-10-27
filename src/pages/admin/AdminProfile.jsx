import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useProblems } from '../../context/ProblemsContext.jsx'

export default function AdminProfile() {
  const { getProfile, updateProfile, logout } = useAuth()
  const { problems } = useProblems()
  const navigate = useNavigate()

  const profile = getProfile('admin')
  const resolvedByAdmin = problems.filter((p) => p.status === 'Resolved').length

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: profile.name, roleTitle: profile.roleTitle || 'Facilities Administrator' })
  const [saved, setSaved] = useState(false)

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile('admin', form)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="cf-section-tight">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="cf-card p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="cf-avatar" style={{ background: 'var(--cf-indigo)' }}>{initials}</div>
                <div>
                  <h1 className="h4 mb-0">{profile.name}</h1>
                  <span className="text-muted small">{profile.email}</span>
                </div>
              </div>

              {saved && <div className="alert alert-success py-2 small">Profile updated.</div>}

              {!editing ? (
                <>
                  <dl className="row small mb-4">
                    <dt className="col-5 text-muted">Role</dt>
                    <dd className="col-7">{profile.roleTitle || 'Facilities Administrator'}</dd>
                  </dl>

                  <div className="cf-stat-card text-center mb-4" style={{ maxWidth: 220 }}>
                    <div className="cf-stat-value">{resolvedByAdmin}</div>
                    <div className="cf-stat-label">Problems Resolved Campus-wide</div>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-cf-indigo" onClick={() => setEditing(true)}>
                      <i className="bi bi-pencil me-2"></i>Edit Profile
                    </button>
                    <button className="btn btn-cf-outline" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Name</label>
                    <input className="form-control" value={form.name} onChange={handleChange('name')} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-semibold">Role</label>
                    <input className="form-control" value={form.roleTitle} onChange={handleChange('roleTitle')} />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-cf-amber">Save Changes</button>
                    <button type="button" className="btn btn-cf-outline" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
