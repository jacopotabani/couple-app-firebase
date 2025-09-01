import { useState } from 'react'
import { 
  AuthUser, 
  SignUpData, 
  SignInData, 
  AuthError 
} from '@couple-app/firebase'
import { useAuthContext } from '../contexts/AuthContext'

// Platform-specific auth methods - we'll import based on platform
let authMethods: any = null

// This will be set by the platform-specific setup
export const setAuthMethods = (methods: any) => {
  authMethods = methods
}

export interface UseAuthReturn {
  // Current user state
  firebaseUser: AuthUser | null
  user: any | null
  isLoading: boolean
  isInitializing: boolean
  
  // Auth operations
  signUp: ( SignUpData) => Promise<AuthUser>
  signIn: ( SignInData) => Promise<AuthUser>
  signInWithGoogle: () => Promise<AuthUser>
  signInWithApple: () => Promise<AuthUser>
  signOut: () => Promise<void>
  
  // Utility methods
  refreshUser: () => Promise<void>
  
  // Operation states
  isSigningUp: boolean
  isSigningIn: boolean
  isSigningOut: boolean
  error: AuthError | null
}

export const useAuth = (): UseAuthReturn => {
  const { 
    firebaseUser, 
    user, 
    isLoading, 
    isInitializing, 
    refreshUser, 
    clearUser 
  } = useAuthContext()

  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  const clearError = () => setError(null)

  const signUp = async ( SignUpData): Promise<AuthUser> => {
    if (!authMethods?.signUpWithEmail) {
      throw new Error('Auth methods not initialized')
    }

    try {
      setIsSigningUp(true)
      clearError()
      
      const user = await authMethods.signUpWithEmail(data)
      return user
    } catch (error) {
      setError(error as AuthError)
      throw error
    } finally {
      setIsSigningUp(false)
    }
  }

  const signIn = async ( SignInData): Promise<AuthUser> => {
    if (!authMethods?.signInWithEmail) {
      throw new Error('Auth methods not initialized')
    }

    try {
      setIsSigningIn(true)
      clearError()
      
      const user = await authMethods.signInWithEmail(data)
      return user
    } catch (error) {
      setError(error as AuthError)
      throw error
    } finally {
      setIsSigningIn(false)
    }
  }

  const signInWithGoogle = async (): Promise<AuthUser> => {
    if (!authMethods?.signInWithGoogle) {
      throw new Error('Google Sign-In not available on this platform')
    }

    try {
      setIsSigningIn(true)
      clearError()
      
      const user = await authMethods.signInWithGoogle()
      return user
    } catch (error) {
      setError(error as AuthError)
      throw error
    } finally {
      setIsSigningIn(false)
    }
  }

  const signInWithApple = async (): Promise<AuthUser> => {
    if (!authMethods?.signInWithApple) {
      throw new Error('Apple Sign-In not available on this platform')
    }

    try {
      setIsSigningIn(true)
      clearError()
      
      const user = await authMethods.signInWithApple()
      return user
    } catch (error) {
      setError(error as AuthError)
      throw error
    } finally {
      setIsSigningIn(false)
    }
  }

  const signOut = async (): Promise<void> => {
    if (!authMethods?.signOut) {
      throw new Error('Auth methods not initialized')
    }

    try {
      setIsSigningOut(true)
      clearError()
      
      await authMethods.signOut()
      clearUser()
    } catch (error) {
      setError(error as AuthError)
      throw error
    } finally {
      setIsSigningOut(false)
    }
  }

  return {
    firebaseUser,
    user,
    isLoading,
    isInitializing,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    refreshUser,
    isSigningUp,
    isSigningIn,
    isSigningOut,
    error,
  }
}
