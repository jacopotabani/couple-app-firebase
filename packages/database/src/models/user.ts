import { ObjectId } from 'mongodb'
import { z } from 'zod'

export interface User {
  _id: ObjectId
  firebaseUid: string
  email: string
  name: string
  avatar_url?: string
  created_at: Date
  updated_at: Date
}

export interface UserDocument extends Omit<User, '_id'> {
  _id?: ObjectId
}

export const CreateUserSchema = z.object({
  firebaseUid: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1).max(255),
  avatar_url: z.string().url().optional(),
})

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  avatar_url: z.string().url().optional(),
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>

export const COLLECTION_NAME = 'users'

export const createUserIndexes = [
  { key: { firebaseUid: 1 }, unique: true },
  { key: { email: 1 }, unique: true },
  { key: { created_at: 1 } },
]
