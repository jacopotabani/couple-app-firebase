// Export connection utilities
export { 
  initDatabase, 
  getDatabase, 
  connectDatabase, 
  disconnectDatabase,
  type DatabaseConfig 
} from './connection'

// Export models with specific imports to avoid COLLECTION_NAME conflicts
export type { 
  User, 
  UserDocument, 
  CreateUserInput, 
  UpdateUserInput 
} from './models/user'

export type { 
  Couple, 
  CoupleDocument, 
  CreateCoupleInput, 
  UpdateCoupleInput 
} from './models/couple'

export type { 
  CoupleMember, 
  CoupleMemberDocument, 
  CreateMemberInput, 
  UpdateMemberInput,
  CoupleMemberWithUser,
  CoupleWithMembers 
} from './models/couple-member'

// Export specific functions from models
export { 
  CreateUserSchema, 
  UpdateUserSchema 
} from './models/user'

export { 
  CreateCoupleSchema, 
  UpdateCoupleSchema, 
  generateCoupleCode 
} from './models/couple'

export { 
  CreateMemberSchema, 
  UpdateMemberSchema 
} from './models/couple-member'

// Export services
export { UserService } from './services/userService'
export { CoupleService } from './services/coupleService'

// Export setup utilities
export { createAllIndexes } from './setup/indexes'

// Export collection names with prefixes to avoid conflicts
export { COLLECTION_NAME as USER_COLLECTION } from './models/user'
export { COLLECTION_NAME as COUPLE_COLLECTION } from './models/couple'
export { COLLECTION_NAME as MEMBER_COLLECTION } from './models/couple-member'
