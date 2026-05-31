import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Movie = {
  _id?: string
  slug: string
  title: string
  type: 'Movie' | 'Series' | 'Anime'
  year: number
  rating: number
  runtime: string
  quality: string[]
  genres: string[]
  platforms: string[]
  languages: string[]
  poster: string
  backdrop: string
  overview: string
  cast: string[]
  trailer: string
  featured?: boolean
  trendingScore: number
}

type Filters = {
  q: string
  genre: string
  year: string
  quality: string
  type: string
}

type Theme = 'dark' | 'light'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''
const THEME_STORAGE_KEY = 'vidzo-theme'

const fallbackMovies: Movie[] = [
  {
    slug: 'dune-part-two',
    title: 'Dune: Part Two',
    type: 'Movie',
    year: 2024,
    rating: 8.5,
    runtime: '2h 46m',
    quality: ['4K', '1080p', '720p'],
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    platforms: ['Max', 'Prime Video'],
    languages: ['English', 'Hindi'],
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    overview:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    cast: ['Timothee Chalamet', 'Zendaya', 'Rebecca Ferguson'],
    trailer: 'https://www.youtube.com/results?search_query=Dune+Part+Two+trailer',
    featured: true,
    trendingScore: 98,
  },
  {
    slug: 'oppenheimer',
    title: 'Oppenheimer',
    type: 'Movie',
    year: 2023,
    rating: 8.3,
    runtime: '3h 0m',
    quality: ['4K', '1080p'],
    genres: ['Biography', 'Drama', 'History'],
    platforms: ['Prime Video', 'Apple TV+'],
    languages: ['English', 'Hindi'],
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    overview:
      'The story of J. Robert Oppenheimer and the scientific race that changed the course of modern history.',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.'],
    trailer: 'https://www.youtube.com/results?search_query=Oppenheimer+trailer',
    trendingScore: 94,
  },
  {
    slug: 'spider-man-across-the-spider-verse',
    title: 'Spider-Man: Across the Spider-Verse',
    type: 'Movie',
    year: 2023,
    rating: 8.6,
    runtime: '2h 20m',
    quality: ['4K', '1080p', '720p'],
    genres: ['Animation', 'Action', 'Adventure'],
    platforms: ['Netflix', 'Sony LIV'],
    languages: ['English', 'Hindi'],
    poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    overview:
      'Miles Morales catapults across the Multiverse, where he meets a team of Spider-People protecting its existence.',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
    trailer: 'https://www.youtube.com/results?search_query=Across+the+Spider-Verse+trailer',
    trendingScore: 93,
  },
  {
    slug: 'the-last-of-us',
    title: 'The Last of Us',
    type: 'Series',
    year: 2023,
    rating: 8.7,
    runtime: '1 Season',
    quality: ['1080p', '720p'],
    genres: ['Drama', 'Thriller', 'Adventure'],
    platforms: ['Max', 'JioHotstar'],
    languages: ['English', 'Hindi'],
    poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/2MaumbgBlW1NoPo3ZJO38A6v7OS.jpg',
    overview:
      'A hardened survivor escorts a teenager across a ravaged America in a story about loss, loyalty, and hope.',
    cast: ['Pedro Pascal', 'Bella Ramsey', 'Anna Torv'],
    trailer: 'https://www.youtube.com/results?search_query=The+Last+of+Us+trailer',
    featured: true,
    trendingScore: 91,
  },
  {
    slug: 'shogun',
    title: 'Shogun',
    type: 'Series',
    year: 2024,
    rating: 8.7,
    runtime: '10 Episodes',
    quality: ['4K', '1080p'],
    genres: ['Drama', 'History', 'War'],
    platforms: ['Disney+', 'Hulu'],
    languages: ['English', 'Japanese'],
    poster: 'https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/2meX1nMdScFOoV4370rqHWKmXhY.jpg',
    overview:
      'A shipwrecked English pilot enters a world of political intrigue in feudal Japan.',
    cast: ['Hiroyuki Sanada', 'Cosmo Jarvis', 'Anna Sawai'],
    trailer: 'https://www.youtube.com/results?search_query=Shogun+2024+trailer',
    trendingScore: 90,
  },
  {
    slug: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    type: 'Anime',
    year: 2020,
    rating: 8.6,
    runtime: '2 Seasons',
    quality: ['1080p', '720p'],
    genres: ['Anime', 'Action', 'Fantasy'],
    platforms: ['Crunchyroll', 'Netflix'],
    languages: ['Japanese', 'Hindi', 'English'],
    poster: 'https://image.tmdb.org/t/p/w500/hFWP5HkbVEe40hrXgtCeQxoccHE.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/gmECX1DvFgdUPjtio2zaL8BPYPu.jpg',
    overview:
      'A high-school student joins a secret organization of sorcerers to fight powerful curses.',
    cast: ['Junya Enoki', 'Yuma Uchida', 'Asami Seto'],
    trailer: 'https://www.youtube.com/results?search_query=Jujutsu+Kaisen+trailer',
    trendingScore: 88,
  },
]

const emptyFilters: Filters = {
  q: '',
  genre: 'All',
  year: 'All',
  quality: 'All',
  type: 'All',
}

function readInitialTheme(): Theme {
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function App() {
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [movies, setMovies] = useState<Movie[]>(fallbackMovies)
  const [selectedMovie, setSelectedMovie] = useState<Movie>(fallbackMovies[0])
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [status, setStatus] = useState('Loading MongoDB catalog...')
  const [theme, setTheme] = useState<Theme>(readInitialTheme)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiReason, setAiReason] = useState('')
  const [aiPicks, setAiPicks] = useState<Movie[]>([])
  const [showAiPicks, setShowAiPicks] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'All') params.set(key, value)
    })

    fetch(`${API_BASE}/api/movies?${params.toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable')
        return response.json()
      })
      .then((data: { movies: Movie[]; source?: string }) => {
        if (data.movies.length > 0) {
          setMovies(data.movies)
          setSelectedMovie((current) => data.movies.find((movie) => movie.slug === current.slug) ?? data.movies[0])
          setStatus(data.source === 'mongodb' ? 'Live MongoDB catalog' : 'Demo catalog loaded')
        }
      })
      .catch(() => {
        const localMovies = filterMovies(fallbackMovies, filters)
        setMovies(localMovies)
        setSelectedMovie((current) => localMovies.find((movie) => movie.slug === current.slug) ?? localMovies[0] ?? fallbackMovies[0])
        setStatus('Local demo catalog')
      })

    return () => controller.abort()
  }, [filters])

  const featured = useMemo(
    () => movies.find((movie) => movie.featured) ?? movies[0] ?? fallbackMovies[0],
    [movies],
  )

  const genres = useMemo(
    () => ['All', ...Array.from(new Set(fallbackMovies.flatMap((movie) => movie.genres))).sort()],
    [],
  )
  const years = useMemo(
    () => ['All', ...Array.from(new Set(fallbackMovies.map((movie) => String(movie.year)))).sort((a, b) => Number(b) - Number(a))],
    [],
  )
  const qualities = ['All', '4K', '1080p', '720p']
  const types = ['All', 'Movie', 'Series', 'Anime']

  const toggleWatchlist = (slug: string) => {
    setWatchlist((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    )
  }

  const catalog = useMemo(() => {
    const merged = new Map<string, Movie>()
    ;[...fallbackMovies, ...movies].forEach((movie) => merged.set(movie.slug, movie))
    return Array.from(merged.values())
  }, [movies])

  const runAiRecommendations = () => {
    setAiLoading(true)
    setShowAiPicks(true)

    window.setTimeout(() => {
      const { movies: picks, reason } = getAiRecommendations(catalog, watchlist, selectedMovie, filters)
      setAiPicks(picks)
      setAiReason(reason)
      setAiLoading(false)
      document.getElementById('ai-picks')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 650)
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Vidzo home">
          <span className="brand-mark">V</span>
          <span>Vidzo</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#catalog">Catalog</a>
          <a href="#trending">Trending</a>
          <a href="#ai-picks">AI Picks</a>
          <a href="#watchlist">Watchlist</a>
        </nav>
        <div className="header-actions">
          <div className="theme-toggle" role="group" aria-label="Color theme">
            <button
              type="button"
              className={`theme-button${theme === 'dark' ? ' is-active' : ''}`}
              onClick={() => setTheme('dark')}
              aria-pressed={theme === 'dark'}
            >
              Dark
            </button>
            <button
              type="button"
              className={`theme-button${theme === 'light' ? ' is-active' : ''}`}
              onClick={() => setTheme('light')}
              aria-pressed={theme === 'light'}
            >
              Bright
            </button>
          </div>
          <button
            type="button"
            className="ai-recommend-btn"
            onClick={runAiRecommendations}
            disabled={aiLoading}
            aria-busy={aiLoading}
          >
            {aiLoading ? 'Analyzing taste…' : '✦ AI movie picks'}
          </button>
          <button className="icon-button" type="button" aria-label="Search catalog" title="Search catalog">
            <span aria-hidden="true">⌕</span>
          </button>
        </div>
      </header>

      <section className="hero-section" id="top">
        <img className="hero-backdrop" src={featured.backdrop} alt="" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">{status}</p>
          <h1>Find your next movie night in seconds.</h1>
          <p className="hero-copy">
            Search by title, actor, genre, year, language, quality, or platform. Built from your plan with
            a fast movie catalog, rich filters, detail previews, and watchlist flow.
          </p>
          <form className="search-panel" role="search" onSubmit={(event) => event.preventDefault()}>
            <label className="search-input">
              <span>Search</span>
              <input
                value={filters.q}
                onChange={(event) => setFilters({ ...filters, q: event.target.value })}
                placeholder="Search movies, actors, anime..."
              />
            </label>
            <button type="button" onClick={() => setFilters({ ...filters })}>
              Search
            </button>
          </form>
          <div className="hero-actions">
            <a className="primary-action" href="#catalog">
              Browse catalog
            </a>
            <button className="secondary-action" type="button" onClick={() => setSelectedMovie(featured)}>
              Preview featured
            </button>
            <button className="secondary-action" type="button" onClick={runAiRecommendations} disabled={aiLoading}>
              {aiLoading ? 'Finding picks…' : 'Get AI picks'}
            </button>
          </div>
        </div>
        <aside className="spotlight-card" aria-label="Featured title">
          <img src={featured.poster} alt={`${featured.title} poster`} />
          <div>
            <p>{featured.type} • {featured.year} • {featured.quality[0]}</p>
            <h2>{featured.title}</h2>
            <span>★ {featured.rating.toFixed(1)}</span>
          </div>
        </aside>
      </section>

      <section className="category-strip" aria-label="Quick categories">
        {['Netflix', 'Prime Video', 'Anime', 'K-Drama', '4K', 'Hindi Dubbed', 'Sci-Fi', 'Thriller'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              setFilters({
                ...emptyFilters,
                q: ['Netflix', 'Prime Video'].includes(item) ? item : '',
                genre: ['Anime', 'Sci-Fi', 'Thriller'].includes(item) ? item : 'All',
                quality: item === '4K' ? '4K' : 'All',
              })
            }
          >
            {item}
          </button>
        ))}
      </section>

      {(showAiPicks || aiPicks.length > 0) && (
        <section className="recommendations-band" id="ai-picks" aria-live="polite">
          <div className="section-heading">
            <div>
              <p className="eyebrow">AI recommendations</p>
              <h2>Personalized for you</h2>
            </div>
          </div>
          <div className="recommendations-panel">
            {aiLoading ? (
              <p>Vidzo AI is reading your watchlist, filters, and browsing patterns…</p>
            ) : (
              <>
                <p>{aiReason}</p>
                <div className="recommendation-grid">
                  {aiPicks.map((movie) => (
                    <button
                      key={movie.slug}
                      type="button"
                      className="recommendation-card"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
                      <h3>{movie.title}</h3>
                      <span>
                        ★ {movie.rating.toFixed(1)} · {movie.genres.slice(0, 2).join(', ')}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <section className="dashboard-band" id="catalog">
        <div className="section-heading">
          <p className="eyebrow">Smart catalog</p>
          <h2>Search, filter, and preview titles</h2>
        </div>
        <div className="filters" aria-label="Catalog filters">
          <FilterSelect label="Genre" value={filters.genre} values={genres} onChange={(genre) => setFilters({ ...filters, genre })} />
          <FilterSelect label="Year" value={filters.year} values={years} onChange={(year) => setFilters({ ...filters, year })} />
          <FilterSelect label="Quality" value={filters.quality} values={qualities} onChange={(quality) => setFilters({ ...filters, quality })} />
          <FilterSelect label="Type" value={filters.type} values={types} onChange={(type) => setFilters({ ...filters, type })} />
        </div>
        <div className="movie-grid" id="trending">
          {movies.map((movie) => (
            <article className="movie-card" key={movie.slug}>
              <button type="button" className="poster-button" onClick={() => setSelectedMovie(movie)}>
                <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
              </button>
              <div className="movie-card-body">
                <div className="meta-row">
                  <span>{movie.quality[0]}</span>
                  <span>★ {movie.rating.toFixed(1)}</span>
                </div>
                <h3>{movie.title}</h3>
                <p>{movie.year} • {movie.type} • {movie.genres.slice(0, 2).join(', ')}</p>
                <div className="card-actions">
                  <button type="button" onClick={() => setSelectedMovie(movie)}>
                    Details
                  </button>
                  <button type="button" onClick={() => toggleWatchlist(movie.slug)} aria-pressed={watchlist.includes(movie.slug)}>
                    {watchlist.includes(movie.slug) ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="detail-band">
        <div className="detail-poster">
          <img src={selectedMovie.poster} alt={`${selectedMovie.title} poster`} />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">Movie detail page preview</p>
          <h2>{selectedMovie.title}</h2>
          <p>{selectedMovie.overview}</p>
          <div className="detail-tags">
            {[selectedMovie.type, String(selectedMovie.year), selectedMovie.runtime, ...selectedMovie.languages].map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <dl className="detail-list">
            <div>
              <dt>Cast</dt>
              <dd>{selectedMovie.cast.join(', ')}</dd>
            </div>
            <div>
              <dt>Platforms</dt>
              <dd>{selectedMovie.platforms.join(', ')}</dd>
            </div>
          </dl>
          <a className="primary-action" href={selectedMovie.trailer} target="_blank" rel="noreferrer">
            Watch trailer
          </a>
        </div>
      </section>

      <section className="watchlist-band" id="watchlist">
        <div>
          <p className="eyebrow">Personal picks</p>
          <h2>Your watchlist has {watchlist.length} saved {watchlist.length === 1 ? 'title' : 'titles'}</h2>
        </div>
        <div className="watchlist-items">
          {watchlist.length === 0 ? (
            <p>Save titles from the catalog and they will appear here.</p>
          ) : (
            watchlist.map((slug) => {
              const movie = [...movies, ...fallbackMovies].find((item) => item.slug === slug)
              return movie ? <span key={slug}>{movie.title}</span> : null
            })
          )}
        </div>
      </section>
    </main>
  )
}

function FilterSelect({
  label,
  value,
  values,
  onChange,
}: {
  label: string
  value: string
  values: string[]
  onChange: (value: string) => void
}) {
  return (
    <label>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  )
}

function getAiRecommendations(
  catalog: Movie[],
  watchlist: string[],
  selectedMovie: Movie,
  filters: Filters,
): { movies: Movie[]; reason: string } {
  const watchlistMovies = catalog.filter((movie) => watchlist.includes(movie.slug))
  const anchors = watchlistMovies.length > 0 ? watchlistMovies : [selectedMovie]
  const preferredGenres = new Set(anchors.flatMap((movie) => movie.genres))
  const preferredTypes = new Set(anchors.map((movie) => movie.type))
  const preferredPlatforms = new Set(anchors.flatMap((movie) => movie.platforms))
  const avgRating = anchors.reduce((sum, movie) => sum + movie.rating, 0) / anchors.length
  const query = filters.q.trim().toLowerCase()

  const picks = catalog
    .filter((movie) => !watchlist.includes(movie.slug) && movie.slug !== selectedMovie.slug)
    .map((movie) => {
      let score = movie.trendingScore * 0.35
      score += movie.genres.filter((genre) => preferredGenres.has(genre)).length * 14
      score += preferredTypes.has(movie.type) ? 10 : 0
      score += movie.platforms.filter((platform) => preferredPlatforms.has(platform)).length * 6
      score += Math.max(0, 12 - Math.abs(movie.rating - avgRating) * 3)
      if (filters.genre !== 'All' && movie.genres.includes(filters.genre)) score += 8
      if (filters.type !== 'All' && movie.type === filters.type) score += 6
      if (query && [movie.title, movie.overview, ...movie.cast].join(' ').toLowerCase().includes(query)) {
        score += 10
      }
      return { movie, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((entry) => entry.movie)

  const reason =
    watchlist.length > 0
      ? `Vidzo AI matched ${watchlist.length} saved title${watchlist.length === 1 ? '' : 's'} to similar genres, platforms, and ratings.`
      : query
        ? `Vidzo AI used your search for "${filters.q}" plus ${selectedMovie.title} to shape these picks.`
        : `Vidzo AI studied ${selectedMovie.title} and your current filters to suggest titles in the same mood.`

  return { movies: picks, reason }
}

function filterMovies(movies: Movie[], filters: Filters) {
  const query = filters.q.trim().toLowerCase()

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

export default App
