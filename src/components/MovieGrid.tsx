import MovieCard from './MovieCard'
import type { Movie } from '../types/tmdb'

interface MovieGridProps {
  movies: Movie[]
  activeSection: string
}

function MovieGrid({ movies, activeSection }: MovieGridProps) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} activeSection={activeSection} />
      ))}
    </div>
  )
}

export default MovieGrid