import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from '../trpc/trpc'

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(255),
})

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const authRouter = router({
  // Sign up new user
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // This endpoint expects the client to handle Firebase auth
        // and then sync the user data to MongoDB
        return {
          message: 'Please handle Firebase signup on the client side',
          data: input,
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process signup',
        })
      }
    }),

  // Sign in user
  signIn: publicProcedure
    .input(signInSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // This endpoint expects the client to handle Firebase auth
        return {
          message: 'Please handle Firebase signin on the client side',
          data: input,
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process signin',
        })
      }
    }),

  // Sync Firebase user with database (called after client-side auth)
  syncUser: publicProcedure
    .input(z.object({
      firebaseToken: z.string(),
      userData: z.object({
        name: z.string().optional(),
        avatar_url: z.string().url().optional(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Verify Firebase token
        const firebaseUser = await ctx.services.userService.findByFirebaseUid('dummy') // This would use Firebase Admin SDK
        
        // For now, return a placeholder response
        return {
          message: 'User sync endpoint ready - Firebase Admin SDK integration needed',
          token: input.firebaseToken.substring(0, 10) + '...',
        }
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to sync user',
        })
      }
    }),
  // Get current user profile
  me: protectedProcedure.query(async ({ ctx }) => {
    return {
      firebaseUser: ctx.firebaseUser,
      user: ctx.user,
    }
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255).optional(),
      avatar_url: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.services.userService.update(
        ctx.user._id.toString(),
        input
      )

      if (!updatedUser) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user profile',
        })
      }

      return { user: updatedUser }
    }),

  // Delete user account
  deleteAccount: protectedProcedure
    .input(z.object({
      confirmation: z.literal('DELETE'),
    }))
    .mutation(async ({ ctx, input }) => {
      // Delete user from database
      const deleted = await ctx.services.userService.delete(
        ctx.user._id.toString()
      )

      if (!deleted) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete account',
        })
      }

      // TODO: Delete Firebase user as well
      // This requires additional Firebase Admin SDK setup

      return { success: true }
    }),

  // Health check
  health: publicProcedure.query(() => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    }
  }),

  // Database health check
  dbHealth: publicProcedure.query(async ({ ctx }) => {
    try {
      // Try to find a user to test database connection
      const testUser = await ctx.services.userService.findByEmail('test@nonexistent.com')
      return {
        status: 'ok',
        database: 'connected',
        testResult: testUser === null ? 'connection_working' : 'unexpected_result',
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Database health check failed:', error)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    }
  }),
})
