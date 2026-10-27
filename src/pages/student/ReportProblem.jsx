import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useProblems } from '../../context/ProblemsContext.jsx'

const CATEGORIES = ['Electrical', 'Plumbing', 'Furniture', 'Cleanliness', 'Infrastructure', 'Other']

export default function ReportProblem() {
  const { user } = useAuth()
  const { addProblem } = useProblems()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [location, setLocation] = useState('')
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      setImage(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('Please fill in the title, description and location.')
      return
    }
    setError('')

    try { await addProblem({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      image,
      studentName: user.name,
      studentEmail: user.email,
    }) } catch (e) { setError(e.message || 'Could not submit problem.'); return }

    setSuccess(true)
    setTimeout(() => navigate('/student/problems'), 900)
  }

  return (
    <div className="cf-section-tight">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <span className="cf-eyebrow">New ticket</span>
            <h1 className="h3 mt-1 mb-4">Report a Problem</h1>

            {success && (
              <div className="alert alert-success">
                <i className="bi bi-check-circle me-2"></i>
                Problem submitted! Redirecting to your Problems page…
              </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}

            <form className="cf-card p-4 p-md-5" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Problem Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Flickering tube light in Room 204"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Describe the problem in a few sentences…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold small">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Academic Block A, Room 204"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Image (optional)</label>
                <label className="cf-dropzone d-block">
                  <i className="bi bi-cloud-upload fs-3 d-block mb-2" style={{ color: 'var(--cf-teal)' }}></i>
                  <span className="small text-muted">Click to upload a photo of the problem</span>
                  <input type="file" accept="image/*" className="d-none" onChange={handleImage} />
                </label>
                {image && <img src={image} alt="Preview" className="cf-thumb mt-3" />}
              </div>

              <button type="submit" className="btn btn-cf-amber px-4 py-2">
                <i className="bi bi-send-check me-2"></i>Submit Problem
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
