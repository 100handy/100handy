import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

/**
 * ProtectedRoute component
 *
 * Wraps routes that require authentication and admin privileges.
 * Redirects to login if not authenticated or not an admin.
 */
export function ProtectedRoute() {
  const { user, isAdmin, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Redirect to login if not an admin
  if (!isAdmin) {
    // Could also redirect to an "access denied" page
    return <Navigate to="/login" replace />
  }

  // Render protected content
  return <Outlet />
}
