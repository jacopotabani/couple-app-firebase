import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from '../trpc/trpc'

export const authRouter = router({
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
})
