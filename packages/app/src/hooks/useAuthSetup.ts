import { useEffect } from 'react'
import { setAuthMethods } from './useAuth'

export interface AuthSetupMethods {
  signUpWithEmail: ( any) => Promise<any>
  signInWithEmail: ( any) => Promise<any>
  signInWithGoogle?: () => Promise<any>
  signInWithApple?: () => Promise<any>
  signOut: () => Promise<void>
}

export const useAuthSetup = (methods: AuthSetupMethods) => {
  useEffect(() => {
    setAuthMethods(methods)
  }, [methods])
}
