import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth'
import { auth } from '../app'
import { AuthUser, mapFirebaseUser, SignUpData, SignInData, AuthError } from './types'

const googleProvider = new GoogleAuthProvider()

export const signUpWithEmail = async ( SignUpData): Promise<AuthUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      data.email, 
      data.password
    )
    
    // Update display name
    await updateProfile(userCredential.user, {
      displayName: data.displayName
    })
    
    // Send email verification
    await sendEmailVerification(userCredential.user)
    
    return mapFirebaseUser(userCredential.user)
  } catch (error: any) {
    throw {
      code: error.code,
      message: error.message
    } as AuthError
  }
}

export const signInWithEmail = async ( SignInData): Promise<AuthUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )
    return mapFirebaseUser(userCredential.user)
  } catch (error: any) {
    throw {
      code: error.code,
      message: error.message
    } as AuthError
  }
}

export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider)
    return mapFirebaseUser(userCredential.user)
  } catch (error: any) {
    throw {
      code: error.code,
      message: error.message
    } as AuthError
  }
}

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth)
  } catch (error: any) {
    throw {
      code: error.code,
      message: error.message
    } as AuthError
  }
}

export const getCurrentUser = (): AuthUser | null => {
  const user = auth.currentUser
  return user ? mapFirebaseUser(user) : null
}

export const onAuthStateChanged = (callback: (user: AuthUser | null) => void) => {
  return auth.onAuthStateChanged((user: FirebaseUser | null) => {
    callback(user ? mapFirebaseUser(user) : null)
  })
}
