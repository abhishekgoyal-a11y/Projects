import mongoose from 'mongoose'

export async function connectDb() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/vidzo'

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 2500,
  })

  return mongoose.connection
}
