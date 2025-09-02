import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

// Validate required Firebase environment variables
const validateFirebaseConfig = () => {
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL'
  ]
  
  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}\n` +
      'Please ensure your .env.local file contains all required Firebase configuration.'
    )
  }
}

// Validate configuration before creating config object
validateFirebaseConfig()

const firebaseConfig = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID!,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL!,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
}

// Initialize Firebase Admin SDK
export const firebaseAdmin = getApps().length === 0 
  ? initializeApp({
      credential: cert(firebaseConfig as ServiceAccount),
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
