import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

// TODO: Import this from the API when the build system allows it
// For now, we'll define a placeholder type
export type AppRouter = any

export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
