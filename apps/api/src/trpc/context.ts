import { Request, Response } from 'express'
import { inferAsyncReturnType } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { verifyFirebaseToken } from '../config/firebase-admin'
import { connectDatabase, UserService, CoupleService } from '@couple-app/database'

// Database services
let userService: UserService
let coupleService: CoupleService

// Initialize database connection and services
const initializeServices = async () => {
  if (!userService || !coupleService) {
    await connectDatabase({
      connectionString: process.env.MONGODB_URI!,
      databaseName: process.env.MONGODB_DB_NAME || 'couple_app_db'
    })
    
    userService = new UserService()
    coupleService = new CoupleService()
  }
  
  return { userService, coupleService }
}

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  // Initialize services
  const services = await initializeServices()

  // Extract authorization token
  const token = req.headers.authorization?.replace('Bearer ', '')
  
  let firebaseUser = null
  let user = null

  if (token) {
    try {
      firebaseUser = await verifyFirebaseToken(token)
      
      // Sync Firebase user with database
      if (firebaseUser) {
        user = await services.userService.findByFirebaseUid(firebaseUser.uid)
        
        // If user doesn't exist in database, create it
        if (!user && firebaseUser.email) {
          user = await services.userService.create({
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.email.split('@')[0], // Default name from email
          })
        }
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      // Don't throw error here - let individual procedures handle auth
    }
  }

  return {
    req,
    res,
    firebaseUser,
    user,
    services,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
