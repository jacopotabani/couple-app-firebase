import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { firebaseConfig } from './config'

// Initialize Firebase app
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase Auth
export const auth = getAuth(firebaseApp)

// Initialize Firebase Storage
export const storage = getStorage(firebaseApp)

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  if (!auth._delegate._config) {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099')
    } catch (error) {
      // Auth emulator already connected
    }
  }

  try {
    connectStorageEmulator(storage, 'localhost', 9199)
  } catch (error) {
    // Storage emulator already connected
  }
}
