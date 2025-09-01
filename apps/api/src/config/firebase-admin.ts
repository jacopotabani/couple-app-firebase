import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import path from 'path'

// Path to credentials file (relative to project root)
const credentialsPath = path.join(process.cwd(), '../../credentials.json')

// Initialize Firebase Admin SDK
export const firebaseAdmin = getApps().length === 0 
  ? initializeApp({
      credential: cert(credentialsPath),
    })
  : getApps()[0]

// Export auth instance
export const adminAuth = getAuth(firebaseAdmin)

export const verifyFirebaseToken = async (token: string) => {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      emailVerified: decodedToken.email_verified || false,
    }
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}
