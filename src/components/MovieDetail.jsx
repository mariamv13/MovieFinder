import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_BASE = 'https://image.tmdb.org/t/p/w500'
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'

function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/movie/${id}`, {
          params: { api_key: API_KEY, language: 'es-ES' }
        })
        setMovie(res.data)
      } catch (error) {
        console.error('Error al cargar la película:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetail