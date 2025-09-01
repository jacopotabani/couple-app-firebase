import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'
import type { Context } from './context'

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
       {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    }
  },
})

// Export reusable router and procedure helpers
export const router = t.router
export const middleware = t.middleware

// Base procedure
export const publicProcedure = t.procedure

// Auth middleware
const isAuthenticated = middleware(async ({ ctx, next }) => {
  if (!ctx.firebaseUser || !ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    })
  }

  return next({
    ctx: {
      ...ctx,
      firebaseUser: ctx.firebaseUser,
      user: ctx.user,
    },
  })
})

// Email verified middleware
const isEmailVerified = middleware(async ({ ctx, next }) => {
  if (!ctx.firebaseUser?.emailVerified) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Email verification required',
    })
  }

  return next({
    ctx,
  })
})

// Protected procedures
export const protectedProcedure = publicProcedure.use(isAuthenticated)
export const verifiedProcedure = protectedProcedure.use(isEmailVerified)
