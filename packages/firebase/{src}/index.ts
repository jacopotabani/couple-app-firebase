// Export main Firebase instances
export { firebaseApp, auth, storage } from './app'
export { firebaseConfig, validateConfig } from './config'

// Export auth functions
export * from './auth/types'
export * as webAuth from './auth/web'
export * as nativeAuth from './auth/native'

// Export storage functions
export * from './storage'
