import { MongoClient, Db } from 'mongodb'

export interface DatabaseConfig {
  connectionString: string
  databaseName: string
}

class DatabaseConnection {
  private client: MongoClient | null = null
  private db: Db | null = null
  private config: DatabaseConfig

  constructor(config: DatabaseConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    try {
      if (!this.client) {
        this.client = new MongoClient(this.config.connectionString, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        })
        
        await this.client.connect()
        this.db = this.client.db(this.config.databaseName)
        
        console.log(`✅ Connected to MongoDB: ${this.config.databaseName}`)
      }
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
      console.log('📤 Disconnected from MongoDB')
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.')
    }
    return this.db
  }

  isConnected(): boolean {
    return this.client !== null && this.db !== null
  }
}

// Singleton instance
let dbConnection: DatabaseConnection | null = null

export const initDatabase = (config: DatabaseConfig): DatabaseConnection => {
  if (!dbConnection) {
    dbConnection = new DatabaseConnection(config)
  }
  return dbConnection
}

export const getDatabase = (): Db => {
  if (!dbConnection) {
    throw new Error('Database not initialized. Call initDatabase() first.')
  }
  return dbConnection.getDb()
}

export const connectDatabase = async (config: DatabaseConfig): Promise<void> => {
  const db = initDatabase(config)
  await db.connect()
}

export const disconnectDatabase = async (): Promise<void> => {
  if (dbConnection) {
    await dbConnection.disconnect()
  }
}
