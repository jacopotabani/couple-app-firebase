// Export connection utilities
export { 
  initDatabase, 
  getDatabase, 
  connectDatabase, 
  disconnectDatabase,
  type DatabaseConfig 
} from './connection'

// Export models
export * from './models/user'
export * from './models/couple'
export * from './models/couple-member'

// Export services
export { UserService } from './services/userService'
export { CoupleService } from './services/coupleService'

// Export setup utilities
export { createAllIndexes } from './setup/indexes'
