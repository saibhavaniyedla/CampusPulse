import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const base = user?.role === 'admin' ? '/admin' : user?.role === 'student' ? '/student' : ''

  return (
    <nav className="navbar navbar-expand-lg cf-navbar sticky-top py-3">
      <div className="container">
        <NavLink className="navbar-brand cf-brand" to={user ? base : '/'}>
          <i className="bi bi-wrench-adjustable-circle fs-4"></i>
          CampusPulse <i className="bi bi-star-fill cf-brand-star"></i>
        </NavLink>

        <div className="d-flex align-items-center order-lg-2 gap-2">
          <button
            type="button"
            className="cf-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
          </button>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#cfNavbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className="collapse navbar-collapse" id="cfNavbarContent">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {!user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/" end>Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/about">About</NavLink>
                </li>
                <li className="nav-item ms-lg-2">
                  <NavLink className="btn btn-cf-amber btn-sm px-3" to="/login">
                    Try It Now <i className="bi bi-arrow-right ms-1"></i>
                  </NavLink>
                </li>
              </>
            )}

            {user?.role === 'student' && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/student" end>Home</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/student/problems">Problems</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/student/report">Report a Problem</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/student/profile">Profile</NavLink></li>
                <li className="nav-item">
                  <button className="btn btn-cf-outline btn-sm ms-lg-2" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/admin" end>Home</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/problems">Problems</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/profile">Profile</NavLink></li>
                <li className="nav-item">
                  <button className="btn btn-cf-outline btn-sm ms-lg-2" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
