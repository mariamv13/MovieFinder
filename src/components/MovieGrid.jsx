import MovieCard from './MovieCard'

function MovieGrid({ movies, activeSection }) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} activeSection={activeSection} />
      ))}
    </div>
  )
}

export default MovieGrid