import { router, publicProcedure } from '../trpc/trpc'
import { authRouter } from './auth'

export const appRouter = router({
  // Main health check
  health: publicProcedure.query(() => {
    return {
      status: 'ok',
      message: 'tRPC is working!',
      timestamp: new Date().toISOString(),
    }
  }),

  hello: publicProcedure.query(() => {
    return {
      message: 'Hello from tRPC!',
    }
  }),

  // Sub-routers
  auth: authRouter,
})

export type AppRouter = typeof appRouter
