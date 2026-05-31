import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, text: true },
    type: { type: String, enum: ['Movie', 'Series', 'Anime'], required: true },
    year: { type: Number, required: true, index: true },
    rating: { type: Number, required: true },
    runtime: { type: String, required: true },
    quality: [{ type: String, index: true }],
    genres: [{ type: String, index: true }],
    platforms: [{ type: String }],
    languages: [{ type: String }],
    poster: { type: String, required: true },
    backdrop: { type: String, required: true },
    overview: { type: String, required: true, text: true },
    cast: [{ type: String }],
    trailer: { type: String, required: true },
    featured: { type: Boolean, default: false },
    trendingScore: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
)

movieSchema.index({
  title: 'text',
  overview: 'text',
  genres: 'text',
  cast: 'text',
  platforms: 'text',
  languages: 'text',
})

export const Movie = mongoose.models.Movie ?? mongoose.model('Movie', movieSchema)
