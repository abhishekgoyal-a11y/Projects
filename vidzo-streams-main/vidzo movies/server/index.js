import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connectDb } from './db.js'
import { Movie } from './movie.model.js'
import { seedMovies } from './seed-data.js'

dotenv.config()

const app = express()
const port = process.env.PORT ?? 4000
let mongoReady = false

app.use(cors())
app.use(express.json())

connectDb()
  .then(() => {
    mongoReady = true
    console.log('MongoDB connected')
  })
  .catch((error) => {
    mongoReady = false
    console.warn(`MongoDB not connected, serving demo data: ${error.message}`)
  })

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, mongoReady })
})

app.get('/api/movies', async (request, response) => {
  const filters = normalizeFilters(request.query)

  if (!mongoReady) {
    return response.json({
      movies: filterLocalMovies(seedMovies, filters),
      source: 'demo',
    })
  }

  const mongoQuery = buildMongoQuery(filters)
  const movies = await Movie.find(mongoQuery).sort({ trendingScore: -1, rating: -1 }).limit(40).lean()

  response.json({ movies, source: 'mongodb' })
})

app.get('/api/movies/featured', async (_request, response) => {
  if (!mongoReady) {
    return response.json({ movie: seedMovies.find((movie) => movie.featured) ?? seedMovies[0], source: 'demo' })
  }

  const movie = await Movie.findOne({ featured: true }).sort({ trendingScore: -1 }).lean()
  response.json({ movie, source: 'mongodb' })
})

app.get('/api/movies/:slug', async (request, response) => {
  if (!mongoReady) {
    const movie = seedMovies.find((item) => item.slug === request.params.slug)
    return movie ? response.json({ movie, source: 'demo' }) : response.status(404).json({ message: 'Movie not found' })
  }

  const movie = await Movie.findOne({ slug: request.params.slug }).lean()
  return movie ? response.json({ movie, source: 'mongodb' }) : response.status(404).json({ message: 'Movie not found' })
})

app.get('/api/meta', async (_request, response) => {
  const source = mongoReady ? await Movie.find().select('genres year quality type platforms').lean() : seedMovies
  response.json({
    genres: uniqueSorted(source.flatMap((movie) => movie.genres)),
    years: uniqueSorted(source.map((movie) => String(movie.year))).sort((a, b) => Number(b) - Number(a)),
    qualities: uniqueSorted(source.flatMap((movie) => movie.quality)),
    types: uniqueSorted(source.map((movie) => movie.type)),
    platforms: uniqueSorted(source.flatMap((movie) => movie.platforms)),
    source: mongoReady ? 'mongodb' : 'demo',
  })
})

app.listen(port, () => {
  console.log(`Vidzo API running on http://localhost:${port}`)
})

function normalizeFilters(query) {
  return {
    q: typeof query.q === 'string' ? query.q.trim() : '',
    genre: typeof query.genre === 'string' ? query.genre : 'All',
    year: typeof query.year === 'string' ? query.year : 'All',
    quality: typeof query.quality === 'string' ? query.quality : 'All',
    type: typeof query.type === 'string' ? query.type : 'All',
  }
}

function buildMongoQuery(filters) {
  const query = {}

  if (filters.q) {
    query.$or = [
      { $text: { $search: filters.q } },
      { title: new RegExp(filters.q, 'i') },
      { cast: new RegExp(filters.q, 'i') },
      { platforms: new RegExp(filters.q, 'i') },
      { languages: new RegExp(filters.q, 'i') },
    ]
  }

  if (filters.genre !== 'All') query.genres = filters.genre
  if (filters.year !== 'All') query.year = Number(filters.year)
  if (filters.quality !== 'All') query.quality = filters.quality
  if (filters.type !== 'All') query.type = filters.type

  return query
}

function filterLocalMovies(movies, filters) {
  const query = filters.q.toLowerCase()

  return movies
    .filter((movie) => {
      const haystack = [
        movie.title,
        movie.overview,
        movie.type,
        movie.year,
        ...movie.genres,
        ...movie.cast,
        ...movie.platforms,
        ...movie.languages,
      ]
        .join(' ')
        .toLowerCase()

      return (
        (!query || haystack.includes(query)) &&
        (filters.genre === 'All' || movie.genres.includes(filters.genre)) &&
        (filters.year === 'All' || String(movie.year) === filters.year) &&
        (filters.quality === 'All' || movie.quality.includes(filters.quality)) &&
        (filters.type === 'All' || movie.type === filters.type)
      )
    })
    .sort((a, b) => b.trendingScore - a.trendingScore)
}

function uniqueSorted(items) {
  return Array.from(new Set(items)).sort()
}
