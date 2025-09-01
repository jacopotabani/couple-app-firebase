import { router, publicProcedure } from '../trpc/trpc'

export const appRouter = router({
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
})

export type AppRouter = typeof appRouter
