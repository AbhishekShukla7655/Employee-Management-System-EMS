import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const redirectMap = { ADMIN: '/admin/dashboard', MANAGER: '/manager/dashboard', EMPLOYEE: '/employee/dashboard' }
    return <Navigate to={redirectMap[role] || '/login'} replace />
  }

  return children
}
