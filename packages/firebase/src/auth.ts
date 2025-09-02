import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { auth } from './config'

export type AuthUser = User

// Auth functions
export const signIn = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password)

export const signUp = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password)

export const logout = () => signOut(auth)

export const getCurrentUser = () => auth.currentUser

export { onAuthStateChanged }