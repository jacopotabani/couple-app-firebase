import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  AuthUser, 
  onAuthStateChanged, 
  getCurrentUser,
  auth
} from '@couple-app/firebase'
import { User } from '@couple-app/database'

export interface AuthContextType {
  // Firebase User (immediate auth state)
  firebaseUser: AuthUser | null
  
  // Complete user profile (from MongoDB)
  user: User | null
  
  // Loading states
  isLoading: boolean
  isInitializing: boolean
  
  // Auth methods
  refreshUser: () => Promise<void>
  clearUser: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {
  children: ReactNode
  onUserSync?: (firebaseUser: AuthUser) => Promise<User>
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  onUserSync 
}) => {
  const [firebaseUser, setFirebaseUser] = useState<AuthUser | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Function to sync Firebase user with MongoDB profile
  const syncUserProfile = async (firebaseUser: AuthUser): Promise<User | null> => {
    if (!onUserSync) {
      console.warn('AuthProvider: onUserSync not provided, user profile sync disabled')
      return null
    }

    try {
      setIsLoading(true)
      const userProfile = await onUserSync(firebaseUser)
      setUser(userProfile)
      return userProfile
    } catch (error) {
      console.error('Failed to sync user profile:', error)
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    const currentFirebaseUser = getCurrentUser()
    if (currentFirebaseUser && onUserSync) {
      await syncUserProfile(currentFirebaseUser)
    }
  }

  // Clear user data
  const clearUser = (): void => {
    setFirebaseUser(null)
    setUser(null)
  }

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)
      
      if (firebaseUser) {
        // User signed in - sync with MongoDB
        await syncUserProfile(firebaseUser)
      } else {
        // User signed out - clear data
        setUser(null)
      }
      
      setIsInitializing(false)
    })

    // Clean up subscription
    return unsubscribe
  }, [onUserSync])

  const value: AuthContextType = {
    firebaseUser,
    user,
    isLoading,
    isInitializing,
    refreshUser,
    clearUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
