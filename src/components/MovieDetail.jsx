import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p/w500'
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'
const PROFILE_BASE = 'https://image.tmdb.org/t/p/w185'
const POSTER_BASE = 'https://image.tmdb.org/t/p/w300'

function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [cast, setCast] = useState([])
  const [crew, setCrew] = useState({})
  const [similar, setSimilar] = useState([])
  const [trailerKey, setTrailerKey] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, creditsRes, similarRes, videosRes] = await Promise.all([
          axios.get(`${BASE_URL}/movie/${id}`, {
            params: { api_key: API_KEY, language: 'es-ES' }
          }),
          axios.get(`${BASE_URL}/movie/${id}/credits`, {
            params: { api_key: API_KEY, language: 'es-ES' }
          }),
          axios.get(`${BASE_URL}/movie/${id}/similar`, {
            params: { api_key: API_KEY, language: 'es-ES' }
          }),
          axios.get(`${BASE_URL}/movie/${id}/videos`, {
            params: { api_key: API_KEY, language: 'es-ES' }
          })
        ])

        setMovie(movieRes.data)
        setCast(creditsRes.data.cast.slice(0, 10))

        const directors = creditsRes.data.crew.filter(c => c.job === 'Director')
        const writers = creditsRes.data.crew.filter(c => c.job === 'Screenplay' || c.job === 'Writer' || c.job === 'Story')
        setCrew({ directors, writers })

        setSimilar(similarRes.data.results.slice(0, 6))

        const videos = videosRes.data.results
        let trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube')
        if (!trailer) {
          const videosEn = await axios.get(`${BASE_URL}/movie/${id}/videos`, {
            params: { api_key: API_KEY }
          })
          trailer = videosEn.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
        }
        if (trailer) setTrailerKey(trailer.key)

      } catch (error) {
        console.error('Error al cargar la película:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  if (loading) return <p className="loading">Cargando...</p>
  if (!movie) return <p className="loading">Película no encontrada.</p>

  return (
    <div className="detail-page">
      {movie.backdrop_path && (
        <div
          className="detail-backdrop"
          style={{ backgroundImage: `url(${BACKDROP_BASE}${movie.backdrop_path})` }}
        />
      )}
      <div className="detail-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <div className="detail-content">
          {movie.poster_path && (
            <img
              className="detail-poster"
              src={`${IMG_BASE}${movie.poster_path}`}
              alt={movie.title}
            />
          )}
          <div className="detail-info">
            <h1>{movie.title}</h1>
            {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}
            <div className="detail-meta">
              <span>📅 {movie.release_date?.slice(0, 4)}</span>
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>⏱️ {movie.runtime} min</span>
            </div>
            <div className="genres">
              {movie.genres?.map(g => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>
            <p className="overview">{movie.overview}</p>
            <div className="movie-extra">
              {crew.directors?.length > 0 && (
                <p><span className="extra-label">Dirección</span> {crew.directors.map(d => d.name).join(', ')}</p>
              )}
              {crew.writers?.length > 0 && (
                <p><span className="extra-label">Guión</span> {crew.writers.map(w => w.name).join(', ')}</p>
              )}
              {movie.production_countries?.length > 0 && (
                <p><span className="extra-label">País</span> {movie.production_countries.map(c => c.name).join(', ')}</p>
              )}
              {movie.production_companies?.length > 0 && (
                <p><span className="extra-label">Productora</span> {movie.production_companies.map(c => c.name).join(', ')}</p>
              )}
            </div>
            {trailerKey && (
              <button className="trailer-btn" onClick={() => setShowTrailer(true)}>
                ▶ Ver tráiler
              </button>
            )}
          </div>
        </div>

        {cast.length > 0 && (
          <div className="cast-section">
            <h2 className="cast-title">Reparto</h2>
            <div className="cast-grid">
              {cast.map(actor => (
                <div key={actor.id} className="cast-card">
                  {actor.profile_path ? (
                    <img
                      src={`${PROFILE_BASE}${actor.profile_path}`}
                      alt={actor.name}
                    />
                  ) : (
                    <div className="no-profile">👤</div>
                  )}
                  <div className="cast-info">
                    <span className="cast-name">{actor.name}</span>
                    <span className="cast-character">{actor.character}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {similar.length > 0 && (
          <div className="similar-section">
            <h2 className="cast-title">Películas similares</h2>
            <div className="similar-grid">
              {similar.map(movie => (
                <div
                  key={movie.id}
                  className="similar-card"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  {movie.poster_path ? (
                    <img
                      src={`${POSTER_BASE}${movie.poster_path}`}
                      alt={movie.title}
                    />
                  ) : (
                    <div className="no-poster">Sin imagen</div>
                  )}
                  <div className="similar-info">
                    <span className="similar-title">{movie.title}</span>
                    <span className="similar-year">{movie.release_date?.slice(0, 4)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showTrailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-content" onClick={e => e.stopPropagation()}>
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Tráiler"
              allowFullScreen
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetail