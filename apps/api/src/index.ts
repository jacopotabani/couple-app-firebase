import { config } from 'dotenv'
import { resolve } from 'path'
import { createServer } from './server'
import { connectDatabase, createAllIndexes } from '@couple-app/database'

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') })

const PORT = process.env.PORT || 4000

const startServer = async () => {
  try {
    console.log('🚀 Starting Couple App API Server...')

    // Validate required environment variables
    const requiredEnvVars = [
      'MONGODB_URI',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_CLIENT_EMAIL',
    ]

    const missingEnvVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    )

    if (missingEnvVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingEnvVars.join(', ')}`
      )
    }

    // Initialize and connect to database
    console.log('📊 Connecting to database...')
    await connectDatabase({
      connectionString: process.env.MONGODB_URI!,
      databaseName: 'couple-app'
    })

    // Create database indexes
    console.log('🔧 Creating database indexes...')
    await createAllIndexes()
    console.log('✅ Database setup completed')

    // Create and configure Express app
    const app = createServer()

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🎉 Server running on http://localhost:${PORT}`)
      console.log(`🔗 tRPC API available at http://localhost:${PORT}/trpc`)
      console.log(`🏥 Health check at http://localhost:${PORT}/health`)
    })

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n📴 Received ${signal}. Starting graceful shutdown...`)
      
      server.close(() => {
        console.log('✅ HTTP server closed')
        process.exit(0)
      })

      // Force close after 30 seconds
      setTimeout(() => {
        console.error('⚠️  Forceful shutdown after timeout')
        process.exit(1)
      }, 30000)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()
