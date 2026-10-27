import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Wrap a page with <ProtectedRoute role="student"> or role="admin".
 * - Not logged in            -> redirect to /login
 * - Logged in, wrong role    -> redirect to that role's own home
 * - Logged in, correct role  -> render the page
 */
export default function ProtectedRoute({ role, children }) {
  const { user, ready } = useAuth()

  if (!ready) return null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
  }

  return children
}
