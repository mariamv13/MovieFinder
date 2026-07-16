// --- Listas de películas (populares, top rated, upcoming, search) ---
export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  original_language: string
  original_title: string
  popularity: number
  adult: boolean
  video: boolean
}

export interface TMDBPaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export type MoviesResponse = TMDBPaginatedResponse<Movie>

export interface Section {
  key: string
  label: string
  endpoint: string
}

// --- Detalle extendido de película (endpoint /movie/{id}) ---
export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface MovieDetails extends Movie {
  tagline: string
  runtime: number | null
  genres: Genre[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
}

// --- Créditos (endpoint /movie/{id}/credits) ---
export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface CreditsResponse {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}

export interface CrewInfo {
  directors: CrewMember[]
  writers: CrewMember[]
}

// --- Videos (endpoint /movie/{id}/videos) ---
export interface Video {
  id: string
  key: string
  site: string
  type: string
  name: string
}

export interface VideosResponse {
  id: number
  results: Video[]
}