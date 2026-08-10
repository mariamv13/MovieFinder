import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MovieCard from './MovieCard'
import type { Movie } from '../types/tmdb'

const baseMovie: Movie = {
  id: 1,
  title: 'Dune: Parte Dos',
  overview: '',
  poster_path: '/poster.jpg',
  backdrop_path: null,
  release_date: '2024-03-15',
  vote_average: 8.234,
  vote_count: 100,
  genre_ids: [],
  original_language: 'en',
  original_title: 'Dune: Part Two',
  popularity: 1,
  adult: false,
  video: false,
}

function renderCard(movie: Movie, activeSection: string) {
  return render(
    <MemoryRouter>
      <MovieCard movie={movie} activeSection={activeSection} />
    </MemoryRouter>
  )
}

describe('MovieCard', () => {
  it('shows only the year when the section is not "upcoming"', () => {
    renderCard(baseMovie, 'popular')

    expect(screen.getByText('2024')).toBeInTheDocument()
  })

  it('shows the full formatted date when the section is "upcoming"', () => {
    renderCard(baseMovie, 'upcoming')

    expect(screen.getByText('15 de marzo de 2024')).toBeInTheDocument()
  })

  it('shows an empty date when release_date is missing in "upcoming"', () => {
    renderCard({ ...baseMovie, release_date: '' }, 'upcoming')

    // No debe reventar y no debe mostrar "Invalid Date"
    expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument()
  })

  it('rounds the vote average to one decimal', () => {
    renderCard(baseMovie, 'popular')

    expect(screen.getByText('⭐ 8.2')).toBeInTheDocument()
  })

  it('shows a placeholder when there is no poster', () => {
    renderCard({ ...baseMovie, poster_path: null }, 'popular')

    expect(screen.getByText('Sin imagen')).toBeInTheDocument()
  })
})