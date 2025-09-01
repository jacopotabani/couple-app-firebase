import type { appRouter } from '../../apps/api/src/routers'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

export type AppRouter = typeof appRouter

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
