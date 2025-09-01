import { AuthUser } from '@couple-app/firebase'
import { User, UserService, CreateUserInput } from '@couple-app/database'

export class UserSyncService {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  async syncFirebaseUser(firebaseUser: AuthUser): Promise<User> {
    try {
      // Try to find existing user by Firebase UID
      let user = await this.userService.findByFirebaseUid(firebaseUser.uid)

      if (user) {
        // User exists - update if needed
        const needsUpdate = 
          user.email !== firebaseUser.email ||
          user.name !== (firebaseUser.displayName || user.name)

        if (needsUpdate) {
          user = await this.userService.update(user._id.toString(), {
            email: firebaseUser.email || user.email,
            name: firebaseUser.displayName || user.name,
          }) || user
        }
      } else {
        // User doesn't exist - create new profile
        const createUserData: CreateUserInput = {
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          avatar_url: firebaseUser.photoURL || undefined,
        }

        user = await this.userService.create(createUserData)
      }

      return user
    } catch (error) {
      console.error('Failed to sync Firebase user with database:', error)
      throw new Error('User synchronization failed')
    }
  }
}
