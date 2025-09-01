import { ObjectId, Collection } from 'mongodb'
import { getDatabase } from '../connection'
import {
  User,
  UserDocument,
  CreateUserInput,
  UpdateUserInput,
  USER_COLLECTION,
} from '../index'

export class UserService {
  private collection: Collection<UserDocument>

  constructor() {
    this.collection = getDatabase().collection(USER_COLLECTION)
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    const user = await this.collection.findOne({ firebaseUid })
    return user as User | null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.collection.findOne({ email })
    return user as User | null
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.collection.findOne({ _id: new ObjectId(id) })
    return user as User | null
  }

  async create(data: CreateUserInput): Promise<User> {
    const now = new Date()
    const userDoc: UserDocument = {
      ...data,
      created_at: now,
      updated_at: now,
    }

    const result = await this.collection.insertOne(userDoc)

    const user = await this.collection.findOne({ _id: result.insertedId })
    return user as User
  }

  async update(id: string, data: UpdateUserInput): Promise<User | null> {
    const updateDoc = {
      ...data,
      updated_at: new Date(),
    }

    await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    )

    return this.findById(id)
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async findOrCreate(
    firebaseUid: string,
    userData: Omit<CreateUserInput, 'firebaseUid'>
  ): Promise<User> {
    let user = await this.findByFirebaseUid(firebaseUid)

    if (!user) {
      user = await this.create({
        firebaseUid,
        ...userData,
      })
    }

    return user
  }
}
