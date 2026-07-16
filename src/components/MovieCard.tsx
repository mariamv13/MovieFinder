import { useNavigate } from 'react-router-dom'
import type { Movie } from '../types/tmdb'

interface MovieCardProps {
  movie: Movie
  activeSection: string
}

function MovieCard({ movie, activeSection }: MovieCardProps) {
  const navigate = useNavigate()
  const imgBase = 'https://image.tmdb.org/t/p/w300'

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const displayDate = activeSection === 'upcoming'
    ? formatDate(movie.release_date)
    : movie.release_date?.slice(0, 4)

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      {movie.poster_path ? (
        <img src={`${imgBase}${movie.poster_path}`} alt={movie.title} />
      ) : (
        <div className="no-poster">Sin imagen</div>
      )}
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <span>{displayDate}</span>
        <span>⭐ {movie.vote_average?.toFixed(1)}</span>
      </div>
    </div>
  )
}

export default MovieCard