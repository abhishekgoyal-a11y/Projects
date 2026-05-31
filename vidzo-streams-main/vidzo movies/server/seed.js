import dotenv from 'dotenv'
import { connectDb } from './db.js'
import { Movie } from './movie.model.js'
import { seedMovies } from './seed-data.js'

dotenv.config()

await connectDb()
await Movie.deleteMany({})
await Movie.insertMany(seedMovies)

console.log(`Seeded ${seedMovies.length} movies into MongoDB`)
process.exit(0)
