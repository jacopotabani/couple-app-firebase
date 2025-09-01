import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { createContext } from './trpc/context'
import { appRouter } from './routers'
import {
    compressionMiddleware,
  corsMiddleware,
  helmetMiddleware,
  loggingMiddleware,
  rateLimitMiddleware,
  validateRequestMiddleware,
} from './middleware/security'

export const createServer = () => {
  const app = express()

  // Security middleware
  app.use(helmetMiddleware)
  app.use(corsMiddleware)
  // app.use(compressionMiddleware)
  app.use(loggingMiddleware)
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true, limit: '10mb' }))
  app.use(rateLimitMiddleware)
  app.use(validateRequestMiddleware)

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    })
  })

  // tRPC middleware
  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
      onError: ({ error, path, type, req }) => {
        console.error(`tRPC Error on ${type} ${path}:`, error)
        
        // Log additional context in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Request headers:', req.headers)
          console.error('Error stack:', error.stack)
        }
      },
    })
  )

  // Catch-all for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Route not found',
      path: req.originalUrl,
      method: req.method,
    })
  })

  // Global error handler
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err)
    
    res.status(500).json({
      error: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
    })
  })

  return app
}
