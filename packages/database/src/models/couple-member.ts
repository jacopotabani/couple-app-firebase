import { ObjectId } from 'mongodb'
import { z } from 'zod'
import { Couple } from './couple'

export interface CoupleMember {
  _id: ObjectId
  couple_id: ObjectId
  user_id: ObjectId
  role: 'creator' | 'member'
  status: 'active' | 'pending' | 'left'
  joined_at: Date
  left_at?: Date
}

export interface CoupleMemberDocument extends Omit<CoupleMember, '_id' | 'couple_id' | 'user_id'> {
  _id?: ObjectId
  couple_id: ObjectId
  user_id: ObjectId
}

export const CreateMemberSchema = z.object({
  couple_id: z.string(),
  user_id: z.string(),
  role: z.enum(['creator', 'member']).default('member'),
})

export const UpdateMemberSchema = z.object({
  status: z.enum(['active', 'pending', 'left']).optional(),
  left_at: z.date().optional(),
})

export type CreateMemberInput = z.infer<typeof CreateMemberSchema>
export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>

// Extended interfaces for queries with populated data
export interface CoupleMemberWithUser extends CoupleMember {
  user: {
    _id: ObjectId
    name: string
    email: string
    avatar_url?: string
  }
}

export interface CoupleWithMembers extends Couple {
  members: CoupleMemberWithUser[]
  memberCount: number
}

export const COLLECTION_NAME = 'couple_members'

export const createMemberIndexes = [
  { key: { couple_id: 1, user_id: 1 }, unique: true },
  { key: { couple_id: 1 } },
  { key: { user_id: 1 } },
  { key: { status: 1 } },
  { key: { joined_at: 1 } },
]
