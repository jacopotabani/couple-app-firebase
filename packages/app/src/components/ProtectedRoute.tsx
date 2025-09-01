import React, { ReactNode } from 'react'
import { useAuthContext } from '../contexts/AuthContext'

export interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  requireEmailVerification?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = null,
  requireEmailVerification = false,
}) => {
  const { firebaseUser, isInitializing } = useAuthContext()

  // Still initializing - show loading or nothing
  if (isInitializing) {
    return fallback
  }

  // No user - not authenticated
  if (!firebaseUser) {
    return fallback
  }

  // Check email verification if required
  if (requireEmailVerification && !firebaseUser.emailVerified) {
    return fallback
  }

  // User is authenticated and meets requirements
  return <>{children}</>
}
