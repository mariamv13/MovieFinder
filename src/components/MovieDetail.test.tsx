import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import MovieDetail from './MovieDetail'
import type {
  MovieDetails,
  CastMember,
  CrewMember,
  Video,
  Movie
} from '../types/tmdb'

// --- Mocks de navegación (hoisted para evitar problemas de orden con vi.mock) ---
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// --- Mock de axios ---
vi.mock('axios', () => ({
  default: { get: vi.fn() }
}))

import axios from 'axios'
const mockedGet = vi.mocked(axios.get)

// --- Datos de prueba ---
const baseMovie: MovieDetails = {
  id: 1,
  title: 'Interstellar',
  overview: 'Una odisea espacial.',
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  release_date: '2014-11-05',
  vote_average: 8.6,
  vote_count: 30000,
  genre_ids: [],
  original_language: 'en',
  original_title: 'Interstellar',
  popularity: 100,
  adult: false,
  video: false,
  tagline: 'Mankind was born on Earth. It was never meant to die here.',
  runtime: 169,
  genres: [{ id: 1, name: 'Ciencia ficción' }],
  production_companies: [
    { id: 1, name: 'Legendary Pictures', logo_path: null, origin_country: 'US' }
  ],
  production_countries: [{ iso_3166_1: 'US', name: 'Estados Unidos' }]
}

const castList: CastMember[] = [
  { id: 10, name: 'Matthew McConaughey', character: 'Cooper', profile_path: null, order: 0 }
]

const crewList: CrewMember[] = [
  { id: 20, name: 'Christopher Nolan', job: 'Director', department: 'Directing', profile_path: null },
  { id: 21, name: 'Jonathan Nolan', job: 'Writer', department: 'Writing', profile_path: null }
]

const similarList: Movie[] = [
  {
    id: 2,
    title: 'Gravity',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    release_date: '2013-10-04',
    vote_average: 7.8,
    vote_count: 15000,
    genre_ids: [],
    original_language: 'en',
    original_title: 'Gravity',
    popularity: 50,
    adult: false,
    video: false
  }
]

const trailerVideo: Video = {
  id: 'v1',
  key: 'abc123',
  site: 'YouTube',
  type: 'Trailer',
  name: 'Official Trailer'
}

// Configura el mock de axios.get para responder según el endpoint solicitado
const mockSuccessfulFetch = (overrides?: { videos?: Video[] }) => {
  mockedGet.mockImplementation((url: string) => {
    if (url.includes('/credits')) {
      return Promise.resolve({ data: { id: 1, cast: castList, crew: crewList } })
    }
    if (url.includes('/similar')) {
      return Promise.resolve({ data: { results: similarList } })
    }
    if (url.includes('/videos')) {
      return Promise.resolve({ data: { results: overrides?.videos ?? [trailerVideo] } })
    }
    return Promise.resolve({ data: baseMovie })
  })
}

const renderWithRoute = (id = '1') =>
  render(
    <MemoryRouter initialEntries={[`/movie/${id}`]}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </MemoryRouter>
  )

describe('MovieDetail', () => {
  beforeEach(() => {
    mockedGet.mockReset()
    mockNavigate.mockReset()
    window.scrollTo = vi.fn()
  })

  it('shows a loading state before the data arrives', () => {
    mockedGet.mockReturnValue(new Promise(() => {})) // nunca se resuelve
    renderWithRoute()

    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('renders the movie details once the fetch resolves', async () => {
    mockSuccessfulFetch()
    renderWithRoute()

    expect(await screen.findByText('Interstellar')).toBeInTheDocument()
    expect(screen.getByText('"Mankind was born on Earth. It was never meant to die here."')).toBeInTheDocument()
    expect(screen.getByText('Una odisea espacial.')).toBeInTheDocument()
    expect(screen.getByText('Ciencia ficción')).toBeInTheDocument()
    expect(screen.getByText(/169 min/)).toBeInTheDocument()
    expect(screen.getByText(/8.6/)).toBeInTheDocument()
    expect(screen.getByText(/2014/)).toBeInTheDocument()
  })

  it('renders director, writers, country and production company', async () => {
    mockSuccessfulFetch()
    renderWithRoute()

    await screen.findByText('Interstellar')

    expect(screen.getByText('Christopher Nolan')).toBeInTheDocument()
    expect(screen.getByText('Jonathan Nolan')).toBeInTheDocument()
    expect(screen.getByText('Estados Unidos')).toBeInTheDocument()
    expect(screen.getByText('Legendary Pictures')).toBeInTheDocument()
  })

  it('renders the cast list', async () => {
    mockSuccessfulFetch()
    renderWithRoute()

    await screen.findByText('Interstellar')

    expect(screen.getByText('Matthew McConaughey')).toBeInTheDocument()
    expect(screen.getByText('Cooper')).toBeInTheDocument()
  })

  it('renders similar movies', async () => {
    mockSuccessfulFetch()
    renderWithRoute()

    await screen.findByText('Interstellar')

    expect(screen.getByText('Gravity')).toBeInTheDocument()
  })

  it('shows "Película no encontrada." when the fetch fails', async () => {
    mockedGet.mockRejectedValue(new Error('Network error'))
    renderWithRoute()

    expect(await screen.findByText('Película no encontrada.')).toBeInTheDocument()
  })

  it('does not show the trailer button when there is no YouTube trailer', async () => {
    mockSuccessfulFetch({ videos: [] })
    renderWithRoute()

    await screen.findByText('Interstellar')

    expect(screen.queryByRole('button', { name: '▶ Ver tráiler' })).not.toBeInTheDocument()
  })

  it('opens and closes the trailer modal', async () => {
    const user = userEvent.setup()
    mockSuccessfulFetch()
    renderWithRoute()

    const trailerBtn = await screen.findByRole('button', { name: '▶ Ver tráiler' })
    await user.click(trailerBtn)

    expect(screen.getByTitle('Tráiler')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '✕' }))

    await waitFor(() => {
      expect(screen.queryByTitle('Tráiler')).not.toBeInTheDocument()
    })
  })

  it('calls navigate(-1) when clicking the back button', async () => {
    const user = userEvent.setup()
    mockSuccessfulFetch()
    renderWithRoute()

    const backBtn = await screen.findByRole('button', { name: '← Volver' })
    await user.click(backBtn)

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})