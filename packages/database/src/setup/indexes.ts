import { getDatabase } from '../connection'
import { createUserIndexes } from '../models/user'
import { createCoupleIndexes } from '../models/couple'
import { createMemberIndexes } from '../models/couple-member'
import { COUPLE_COLLECTION, MEMBER_COLLECTION, USER_COLLECTION } from '..'

export const createAllIndexes = async (): Promise<void> => {
  const db = getDatabase()

  console.log('🔧 Creating database indexes...')

  try {
    // Create user indexes
    for (const index of createUserIndexes) {
      await db.collection(USER_COLLECTION).createIndex(index.key as any, {
        unique: index.unique || false,
      })
    }
    console.log('✅ User indexes created')

    // Create couple indexes
    for (const index of createCoupleIndexes) {
      await db.collection(COUPLE_COLLECTION).createIndex(index.key as any, {
        unique: index.unique || false,
      })
    }
    console.log('✅ Couple indexes created')

    // Create member indexes
    for (const index of createMemberIndexes) {
      await db.collection(MEMBER_COLLECTION).createIndex(index.key as any, {
        unique: index.unique || false,
      })
    }
    console.log('✅ Member indexes created')

    console.log('🎉 All indexes created successfully!')
  } catch (error) {
    console.error('❌ Error creating indexes:', error)
    throw error
  }
}
