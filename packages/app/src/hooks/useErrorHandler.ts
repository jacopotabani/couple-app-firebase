import { useState, useCallback } from 'react'
import { AuthError } from '@couple-app/firebase'

export interface ErrorHandler {
  error: AuthError | Error | null
  setError: (error: AuthError | Error | null) => void
  clearError: () => void
  handleError: (error: any) => void
  getErrorMessage: (error: any) => string
}

export const useErrorHandler = (): ErrorHandler => {
  const [error, setError] = useState<AuthError | Error | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((error: any) => {
    console.error('Error occurred:', error)
    setError(error)
  }, [])

  const getErrorMessage = useCallback((error: any): string => {
    if (!error) return ''

    // Firebase Auth specific errors
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          return 'No account found with this email address.'
        case 'auth/wrong-password':
          return 'Incorrect password. Please try again.'
        case 'auth/email-already-in-use':
          return 'This email address is already registered.'
        case 'auth/weak-password':
          return 'Password is too weak. Please use at least 6 characters.'
        case 'auth/invalid-email':
          return 'Please enter a valid email address.'
        case 'auth/too-many-requests':
          return 'Too many failed attempts. Please try again later.'
        case 'auth/network-request-failed':
          return 'Network error. Please check your connection.'
        default:
          return error.message || 'An authentication error occurred.'
      }
    }

    // Generic error message
    return error.message || 'An unexpected error occurred.'
  }, [])

  return {
    error,
    setError,
    clearError,
    handleError,
    getErrorMessage,
  }
}
