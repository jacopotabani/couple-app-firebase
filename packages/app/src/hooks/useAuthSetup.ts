import { useEffect } from 'react'
import { setAuthMethods } from './useAuth'

export interface AuthSetupMethods {
  signUpWithEmail: (data: any) => Promise<any>
  signInWithEmail: (data: any) => Promise<any>
  signInWithGoogle?: () => Promise<any>
  signInWithApple?: () => Promise<any>
  signOut: () => Promise<void>
}

export const useAuthSetup = (methods: AuthSetupMethods) => {
  useEffect(() => {
    setAuthMethods(methods)
  }, [methods])
}
