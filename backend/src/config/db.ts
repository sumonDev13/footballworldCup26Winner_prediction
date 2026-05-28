import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/worldcup26'

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}
