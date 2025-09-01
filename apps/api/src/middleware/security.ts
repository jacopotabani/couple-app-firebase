import { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'

// CORS configuration
export const corsMiddleware = cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000', // Next.js dev
      'http://localhost:8081', // Expo dev
      process.env.FRONTEND_URL,
      process.env.MOBILE_APP_URL,
    ].filter(Boolean)

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
})

// Security headers
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", '', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
})

// Compression middleware
export const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  },
  threshold: 1024, // Only compress responses > 1KB
})

// Request logging
export const loggingMiddleware = morgan('combined', {
  skip: (req, res) => {
    // Skip logging for health checks and non-error responses in production
    if (process.env.NODE_ENV === 'production') {
      return req.url === '/health' && res.statusCode < 400
    }
    return false
  },
})

// Rate limiting middleware
export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Basic rate limiting logic
  // In production, use redis-based rate limiting
  next()
}

// Request validation middleware
export const validateRequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Basic request validation
  if (req.method === 'POST' && !req.is('application/json')) {
    return res.status(400).json({ 
      error: 'Content-Type must be application/json' 
    })
  }
  
  next()
}
