import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MovieGrid from './MovieGrid'
import type { Movie } from '../types/tmdb'

const makeMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: 1,
  title: 'Movie 1',
  overview: '',
  poster_path: null,
  backdrop_path: null,
  release_date: '2024-01-01',
  vote_average: 7.5,
  vote_count: 100,
  genre_ids: [],
  original_language: 'en',
  original_title: 'Movie 1',
  popularity: 10,
  adult: false,
  video: false,
  ...overrides
})

// MovieCard usa useNavigate, así que MovieGrid necesita un Router alrededor
const renderWithRouter = (movies: Movie[], activeSection = 'popular') =>
  render(
    <MemoryRouter>
      <MovieGrid movies={movies} activeSection={activeSection} />
    </MemoryRouter>
  )

describe('MovieGrid', () => {
  it('renders one MovieCard per movie', () => {
    const movies = [
      makeMovie({ id: 1, title: 'Movie 1' }),
      makeMovie({ id: 2, title: 'Movie 2' }),
      makeMovie({ id: 3, title: 'Movie 3' })
    ]

    renderWithRouter(movies)

    expect(screen.getByText('Movie 1')).toBeInTheDocument()
    expect(screen.getByText('Movie 2')).toBeInTheDocument()
    expect(screen.getByText('Movie 3')).toBeInTheDocument()
  })

  it('renders nothing when the movies list is empty', () => {
    const { container } = renderWithRouter([])

    expect(container.querySelector('.movie-grid')).toBeEmptyDOMElement()
  })

  it('passes activeSection down so upcoming dates render fully formatted', () => {
    const movies = [
      makeMovie({ id: 1, title: 'Future Movie', release_date: '2026-12-25' })
    ]

    renderWithRouter(movies, 'upcoming')

    expect(screen.getByText('25 de diciembre de 2026')).toBeInTheDocument()
  })

  it('renders only the year when activeSection is not upcoming', () => {
    const movies = [
      makeMovie({ id: 1, title: 'Past Movie', release_date: '2020-05-10' })
    ]

    renderWithRouter(movies, 'popular')

    expect(screen.getByText('2020')).toBeInTheDocument()
    expect(screen.queryByText('10 de mayo de 2020')).not.toBeInTheDocument()
  })
})