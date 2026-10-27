import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="cf-footer pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-wrench-adjustable-circle fs-4" style={{ color: 'var(--cf-teal)' }}></i>
              <span className="cf-display fs-5" style={{ color: '#fff' }}>
                CampusPulse <i className="bi bi-star-fill" style={{ color: 'var(--cf-amber)' }}></i>
              </span>
            </div>
            <p className="small mb-1">
              A simple way for students to report campus problems and for admins
              to track them through to resolution.
            </p>
            <p className="small fst-italic mb-0" style={{ opacity: 0.85 }}>
              "Know the Issue. Track the Progress. Improve the Campus."
            </p>
          </div>

          <div className="col-6 col-md-4">
            <h6 className="text-uppercase small mb-3" style={{ color: 'var(--cf-amber)', letterSpacing: '0.08em' }}>
              Navigate
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/login">Try It Now</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-4">
            <h6 className="text-uppercase small mb-3" style={{ color: 'var(--cf-amber)', letterSpacing: '0.08em' }}>
              Report Categories
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li>Electrical &amp; Plumbing</li>
              <li>Furniture &amp; Cleanliness</li>
              <li>Infrastructure &amp; more</li>
            </ul>
          </div>
        </div>

        <hr className="cf-perforation my-4" style={{ opacity: 0.25 }} />
        <p className="small text-center mb-0" style={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} CampusPulse. A student-built micro problem reporter.
        </p>
      </div>
    </footer>
  )
}
