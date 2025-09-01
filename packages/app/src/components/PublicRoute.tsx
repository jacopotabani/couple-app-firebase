import React, { ReactNode } from 'react'
import { useAuthContext } from '../contexts/AuthContext'

export interface PublicRouteProps {
  children: ReactNode
  redirectWhenAuthenticated?: ReactNode
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectWhenAuthenticated = null,
}) => {
  const { firebaseUser, isInitializing } = useAuthContext()

  // Still initializing - show the public content
  if (isInitializing) {
    return <>{children}</>
  }

  // User is authenticated - redirect
  if (firebaseUser) {
    return redirectWhenAuthenticated
  }

  // No user - show public content
  return <>{children}</>
}
