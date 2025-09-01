// Export contexts
export { AuthProvider, useAuthContext, type AuthContextType } from './contexts/AuthContext'

// Export hooks
export { useAuth, setAuthMethods, type UseAuthReturn } from './hooks/useAuth'
export { useAuthSetup, type AuthSetupMethods } from './hooks/useAuthSetup'
export { useErrorHandler, type ErrorHandler } from './hooks/useErrorHandler'

// Export components
export { ProtectedRoute, type ProtectedRouteProps } from './components/ProtectedRoute'
export { PublicRoute, type PublicRouteProps } from './components/PublicRoute'

// Export services
export { UserSyncService } from './services/userSyncService'
