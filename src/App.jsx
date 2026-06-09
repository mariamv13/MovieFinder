import { useState, useEffect } from 'react'
import axios from 'axios'
import { Routes, Route } from 'react-router-dom'
import SearchBar from './components/SearchBar'
import MovieGrid from './components/MovieGrid'
import MovieDetail from './components/MovieDetail'
import Pagination from './components/Pagination'
import logo from './assets/logo-moviefinder.png'
import './App.css'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

const SECTIONS = [
  { key: 'popular', label: '🔥 Populares', endpoint: '/movie/popular' },
  { key: 'top_rated', label: '⭐ Mejor valoradas', endpoint: '/movie/top_rated' },
  { key: 'upcoming', label: '🗓️ Próximos estrenos', endpoint: '/movie/upcoming' },
]

function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('popular')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (query.trim() !== '') return
    fetchSection(activeSection, currentPage)
  }, [activeSection, currentPage])

  useEffect(() => {
    if (query.trim() === '') {
      fetchSection(activeSection, 1)
      return
    }

    const delay = setTimeout(() => {
      searchMovies(query, 1)
    }, 500)

    return () => clearTimeout(delay)
  }, [query])

  const fetchSection = async (sectionKey, page) => {
    const section = SECTIONS.find(s => s.key === sectionKey)
    setLoading(true)
    try {
      const res = await axios.get(`${BASE_URL}${section.endpoint}`, {
        params: { api_key: API_KEY, language: 'es-ES', page }
      })
      setMovies(res.data.results)
      setTotalPages(Math.min(res.data.total_pages, 500))
    } catch (error) {
      console.error('Error al cargar sección:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchMovies = async (q, page = currentPage) => {
    setLoading(true)
    try {
      const res = await axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key: API_KEY, language: 'es-ES', query: q, page }
      })
      setMovies(res.data.results)
      setTotalPages(Math.min(res.data.total_pages, 500))
    } catch (error) {
      console.error('Error al buscar películas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSectionChange = (key) => {
    setActiveSection(key)
    setCurrentPage(1)
    setQuery('')
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Routes>
      <Route path="/" element={
        <div className="app">
          <header className="app-header">
            <img src={logo} alt="MovieFinder" className="app-logo" />
            <SearchBar query={query} onQueryChange={setQuery} />
            <nav className="section-nav">
              {SECTIONS.map(s => (
                <button
                  key={s.key}
                  className={`nav-btn ${activeSection === s.key && query === '' ? 'active' : ''}`}
                  onClick={() => handleSectionChange(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </header>
          <main>
            {loading ? (
              <p className="loading">Cargando...</p>
            ) : (
              <>
                <MovieGrid movies={movies} activeSection={activeSection} key={activeSection} />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </main>
        </div>
      } />
      <Route path="/movie/:id" element={<MovieDetail />} />
    </Routes>
  )
}

export default App