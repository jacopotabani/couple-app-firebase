import { ObjectId } from 'mongodb'
import { z } from 'zod'

export interface Couple {
  _id: ObjectId
  name: string
  couple_code: string
  description?: string
  avatar_url?: string
  anniversary_date?: Date
  privacy_level: 'public' | 'private' | 'invite_only'
  is_active: boolean
  created_at: Date
  updated_at: Date
  creator_id: ObjectId
}

export interface CoupleDocument extends Omit<Couple, '_id' | 'creator_id'> {
  _id?: ObjectId
  creator_id: ObjectId
}

export const CreateCoupleSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  anniversary_date: z.date().optional(),
  privacy_level: z.enum(['public', 'private', 'invite_only']).default('private'),
  avatar_url: z.string().url().optional(),
})

export const UpdateCoupleSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  anniversary_date: z.date().optional(),
  privacy_level: z.enum(['public', 'private', 'invite_only']).optional(),
  avatar_url: z.string().url().optional(),
})

export type CreateCoupleInput = z.infer<typeof CreateCoupleSchema>
export type UpdateCoupleInput = z.infer<typeof UpdateCoupleSchema>

export const COLLECTION_NAME = 'couples'

export const createCoupleIndexes = [
  { key: { couple_code: 1 }, unique: true },
  { key: { creator_id: 1 } },
  { key: { created_at: 1 } },
  { key: { is_active: 1 } },
  { key: { privacy_level: 1 } },
]

// Utility function to generate unique couple code
export const generateCoupleCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Exclude confusing chars
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
