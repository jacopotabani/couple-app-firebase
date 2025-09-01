import { config } from 'dotenv'
import { resolve } from 'path'
import { connectDatabase, createAllIndexes, disconnectDatabase } from './index'

// Carica le variabili d'ambiente dalla root del progetto
config({ path: resolve(__dirname, '../../../.env.local') })

const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB connection...')
    console.log('📁 Looking for .env.local at:', resolve(__dirname, '../../../.env.local'))
    
    const mongoUri = process.env.MONGODB_URI
    const dbName = process.env.MONGODB_DB_NAME
    
    console.log('📋 Environment check:')
    console.log(`- MONGODB_URI: ${mongoUri ? 'Set ✅' : 'Missing ❌'}`)
    console.log(`- MONGODB_DB_NAME: ${dbName || 'couple_app_db (default)'}`)
    
    if (!mongoUri) {
      console.log('💡 Current working directory:', process.cwd())
      console.log('💡 Expected .env.local path:', resolve(__dirname, '../../../.env.local'))
      throw new Error('MONGODB_URI environment variable is not set. Please check your .env.local file in the project root.')
    }
    
    if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB URI format. It should start with "mongodb://" or "mongodb+srv://"')
    }
    
    await connectDatabase({
      connectionString: mongoUri,
      databaseName: dbName || 'couple_app_db'
    })
    
    console.log('✅ Database connected successfully!')
    
    await createAllIndexes()
    console.log('✅ Indexes created successfully!')
    
    await disconnectDatabase()
    console.log('✅ Test completed!')
    
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    process.exit(1)
  }
}

testConnection()
