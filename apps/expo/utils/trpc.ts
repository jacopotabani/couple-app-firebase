import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@couple-app/shared'

export const trpc = createTRPCReact<AppRouter>()