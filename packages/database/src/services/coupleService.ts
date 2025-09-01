import { ObjectId, Collection } from 'mongodb'
import { getDatabase } from '../connection'
import {
  Couple,
  CoupleDocument,
  CreateCoupleInput,
  UpdateCoupleInput,
  generateCoupleCode,
  COLLECTION_NAME as COUPLE_COLLECTION
} from '../models/couple'
import {
  CoupleMember,
  CoupleMemberDocument,
  CoupleWithMembers,
  CoupleMemberWithUser,
  COLLECTION_NAME as MEMBER_COLLECTION
} from '../models/couple-member'

export class CoupleService {
  private couplesCollection: Collection<CoupleDocument>
  private membersCollection: Collection<CoupleMemberDocument>

  constructor() {
    this.couplesCollection = getDatabase().collection(COUPLE_COLLECTION)
    this.membersCollection = getDatabase().collection(MEMBER_COLLECTION)
  }

  async getUserCouples(userId: string): Promise<CoupleWithMembers[]> {
    const userObjectId = new ObjectId(userId)
    
    const pipeline = [
      // Find couples where user is a member
      { $match: { user_id: userObjectId, status: 'active' } },
      // Join with couples collection
      {
        $lookup: {
          from: COUPLE_COLLECTION,
          localField: 'couple_id',
          foreignField: '_id',
          as: 'couple'
        }
      },
      { $unwind: '$couple' },
      // Filter active couples
      { $match: { 'couple.is_active': true } },
      // Join with all members of each couple
      {
        $lookup: {
          from: MEMBER_COLLECTION,
          localField: 'couple_id',
          foreignField: 'couple_id',
          as: 'allMembers'
        }
      },
      // Join member data with user data
      {
        $lookup: {
          from: 'users',
          localField: 'allMembers.user_id',
          foreignField: '_id',
          as: 'memberUsers'
        }
      },
      // Project the final structure
      {
        $project: {
          _id: '$couple._id',
          name: '$couple.name',
          couple_code: '$couple.couple_code',
          description: '$couple.description',
          avatar_url: '$couple.avatar_url',
          anniversary_date: '$couple.anniversary_date',
          privacy_level: '$couple.privacy_level',
          is_active: '$couple.is_active',
          created_at: '$couple.created_at',
          updated_at: '$couple.updated_at',
          creator_id: '$couple.creator_id',
          members: {
            $map: {
              input: '$allMembers',
              as: 'member',
              in: {
                $mergeObjects: [
                  '$$member',
                  {
                    user: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$memberUsers',
                            cond: { $eq: ['$$this._id', '$$member.user_id'] }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          },
          memberCount: { $size: '$allMembers' }
        }
      }
    ]

    const result = await this.membersCollection.aggregate(pipeline).toArray()
    return result as CoupleWithMembers[]
  }

  async getCoupleById(coupleId: string, userId: string): Promise<CoupleWithMembers | null> {
    const coupleObjectId = new ObjectId(coupleId)
    const userObjectId = new ObjectId(userId)

    // First check if user is a member of this couple
    const membership = await this.membersCollection.findOne({
      couple_id: coupleObjectId,
      user_id: userObjectId,
      status: 'active'
    })

    if (!membership) {
      return null // User is not a member of this couple
    }

    const pipeline = [
      { $match: { _id: coupleObjectId, is_active: true } },
      // Join with members
      {
        $lookup: {
          from: MEMBER_COLLECTION,
          localField: '_id',
          foreignField: 'couple_id',
          as: 'members'
        }
      },
      // Join members with user data
      {
        $lookup: {
          from: 'users',
          localField: 'members.user_id',
          foreignField: '_id',
          as: 'memberUsers'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          couple_code: 1,
          description: 1,
          avatar_url: 1,
          anniversary_date: 1,
          privacy_level: 1,
          is_active: 1,
          created_at: 1,
          updated_at: 1,
          creator_id: 1,
          members: {
            $map: {
              input: '$members',
              as: 'member',
              in: {
                $mergeObjects: [
                  '$$member',
                  {
                    user: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$memberUsers',
                            cond: { $eq: ['$$this._id', '$$member.user_id'] }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          },
          memberCount: { $size: '$members' }
        }
      }
    ]

    const result = await this.couplesCollection.aggregate(pipeline).toArray()
    return result[0] as CoupleWithMembers | null
  }

  async createCouple( CreateCoupleInput, userId: string): Promise<Couple> {
    const now = new Date()
    const userObjectId = new ObjectId(userId)
    
    // Generate unique couple code
    let coupleCode: string
    let codeExists = true
    
    do {
      coupleCode = generateCoupleCode()
      const existingCouple = await this.couplesCollection.findOne({ couple_code: coupleCode })
      codeExists = !!existingCouple
    } while (codeExists)

    const coupleDoc: CoupleDocument = {
      ...data,
      couple_code: coupleCode,
      is_active: true,
      created_at: now,
      updated_at: now,
      creator_id: userObjectId,
    }

    const result = await this.couplesCollection.insertOne(coupleDoc)
    
    // Add creator as member
    await this.membersCollection.insertOne({
      couple_id: result.insertedId,
      user_id: userObjectId,
      role: 'creator',
      status: 'active',
      joined_at: now,
    })

    const couple = await this.couplesCollection.findOne({ _id: result.insertedId })
    return couple as Couple
  }

  async updateCouple(coupleId: string,  UpdateCoupleInput, userId: string): Promise<Couple | null> {
    const coupleObjectId = new ObjectId(coupleId)
    const userObjectId = new ObjectId(userId)

    // Check if user is the creator
    const couple = await this.couplesCollection.findOne({ _id: coupleObjectId })
    if (!couple || !couple.creator_id.equals(userObjectId)) {
      throw new Error('Only the creator can update couple settings')
    }

    const updateDoc = {
      ...data,
      updated_at: new Date(),
    }

    await this.couplesCollection.updateOne(
      { _id: coupleObjectId },
      { $set: updateDoc }
    )

    return this.couplesCollection.findOne({ _id: coupleObjectId }) as Promise<Couple | null>
  }

  async joinCoupleByCode(coupleCode: string, userId: string): Promise<CoupleMember> {
    const userObjectId = new ObjectId(userId)

    // Find couple by code
    const couple = await this.couplesCollection.findOne({ 
      couple_code: coupleCode, 
      is_active: true 
    })

    if (!couple) {
      throw new Error('Invalid or expired couple code')
    }

    // Check if user is already a member
    const existingMember = await this.membersCollection.findOne({
      couple_id: couple._id,
      user_id: userObjectId
    })

    if (existingMember) {
      throw new Error('You are already a member of this couple')
    }

    // Add user as member
    const memberDoc: CoupleMemberDocument = {
      couple_id: couple._id!,
      user_id: userObjectId,
      role: 'member',
      status: 'active',
      joined_at: new Date(),
    }

    const result = await this.membersCollection.insertOne(memberDoc)
    const member = await this.membersCollection.findOne({ _id: result.insertedId })
    
    return member as CoupleMember
  }

  async getCoupleMembers(coupleId: string, userId: string): Promise<CoupleMemberWithUser[]> {
    const coupleObjectId = new ObjectId(coupleId)
    const userObjectId = new ObjectId(userId)

    // Check if user is a member
    const userMembership = await this.membersCollection.findOne({
      couple_id: coupleObjectId,
      user_id: userObjectId,
      status: 'active'
    })

    if (!userMembership) {
      throw new Error('Access denied: You are not a member of this couple')
    }

    const pipeline = [
      { $match: { couple_id: coupleObjectId, status: 'active' } },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          couple_id: 1,
          user_id: 1,
          role: 1,
          status: 1,
          joined_at: 1,
          left_at: 1,
          user: {
            _id: '$user._id',
            name: '$user.name',
            email: '$user.email',
            avatar_url: '$user.avatar_url'
          }
        }
      }
    ]

    const result = await this.membersCollection.aggregate(pipeline).toArray()
    return result as CoupleMemberWithUser[]
  }

  async removeMember(coupleId: string, memberId: string, userId: string): Promise<void> {
    const coupleObjectId = new ObjectId(coupleId)
    const memberObjectId = new ObjectId(memberId)
    const userObjectId = new ObjectId(userId)

    // Check if user is the creator
    const couple = await this.couplesCollection.findOne({ _id: coupleObjectId })
    if (!couple || !couple.creator_id.equals(userObjectId)) {
      throw new Error('Only the creator can remove members')
    }

    // Cannot remove the creator
    const memberToRemove = await this.membersCollection.findOne({ _id: memberObjectId })
    if (memberToRemove?.role === 'creator') {
      throw new Error('Cannot remove the creator')
    }

    // Update member status
    await this.membersCollection.updateOne(
      { _id: memberObjectId },
      { 
        $set: { 
          status: 'left', 
          left_at: new Date() 
        } 
      }
    )
  }

  async leaveCouple(coupleId: string, userId: string): Promise<void> {
    const coupleObjectId = new ObjectId(coupleId)
    const userObjectId = new ObjectId(userId)

    // Check if user is a member
    const membership = await this.membersCollection.findOne({
      couple_id: coupleObjectId,
      user_id: userObjectId,
      status: 'active'
    })

    if (!membership) {
      throw new Error('You are not a member of this couple')
    }

    // Cannot leave if user is the creator and there are other active members
    if (membership.role === 'creator') {
      const activeMembers = await this.membersCollection.countDocuments({
        couple_id: coupleObjectId,
        status: 'active'
      })

      if (activeMembers > 1) {
        throw new Error('Creator cannot leave couple with active members. Remove other members first or transfer ownership.')
      }
    }

    // Update member status
    await this.membersCollection.updateOne(
      { _id: membership._id },
      { 
        $set: { 
          status: 'left', 
          left_at: new Date() 
        } 
      }
    )
  }
}
