<div align="center">

<img src="src/assets/logo-fondo.png" width="120" alt="MovieFinder Logo" />

# MovieFinder

**Descubre películas con React, TypeScript y la API de TMDB.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![TMDB](https://img.shields.io/badge/TMDB-API-01B4E4?style=flat&logo=themoviedatabase&logoColor=white)](https://themoviedb.org)

</div>

---

## ¿Qué es MovieFinder?

Aplicación web para explorar y buscar películas usando la API de TMDB. Empezó como proyecto para aprender React partiendo de JavaScript vanilla, y más adelante fue migrada íntegramente a TypeScript con modo estricto activado.

---

## Funcionalidades

- Búsqueda de películas en tiempo real
- Sección de películas populares
- Mejor valoradas
- Próximos estrenos con fecha completa
- Página de detalle con backdrop, reparto, géneros y sinopsis

---

## Stack

| Tecnología | Uso |
|---|---|
| React 18 | Framework de UI |
| TypeScript | Tipado estático (strict mode) |
| Vite | Bundler y entorno de desarrollo |
| React Router | Navegación entre páginas |
| Axios | Llamadas a la API, tipadas con genéricos |
| TMDB API | Fuente de datos cinematográficos |

---

## 🔷 Migración a TypeScript

El proyecto nació en JavaScript y fue migrado componente a componente a TypeScript, manteniendo la app funcional en cada paso (convivencia de `.jsx` y `.tsx` vía `allowJs` durante la transición).

**Decisiones de tipado destacadas:**

- **Tipo genérico reutilizable** para las respuestas paginadas de TMDB (`TMDBPaginatedResponse<T>`), en vez de duplicar la misma forma para populares, top rated y búsqueda.
- **Modelado de campos opcionales reales de la API**: TMDB devuelve `null` en `poster_path` y `backdrop_path` cuando una película no tiene imagen, algo que en JavaScript pasaba desapercibido y que ahora el compilador obliga a manejar explícitamente.
- **Extensión de tipos con `extends`**: `MovieDetails` reutiliza todos los campos de `Movie` y añade solo los exclusivos del endpoint de detalle (`tagline`, `runtime`, `genres`...), evitando duplicación.
- **Tipado de hooks de terceros**: parámetros de ruta con `useParams<{ id: string }>()`, y respuestas de Axios tipadas con genéricos (`axios.get<MovieDetails>(...)`) en lugar de castear manualmente.
- **`strict: true` + `noUncheckedIndexedAccess`** activados desde el principio, forzando a manejar casos como una búsqueda (`Array.find`) que no encuentra resultado.

---

## 🧪 Testing

El proyecto cuenta con una suite de tests unitarios y de integración con **Vitest** y **React Testing Library**

| Componente | Tipo de test |
|---|---|
| `SearchBar` | Unitario |
| `Pagination` | Unitario |
| `MovieCard` | Unitario |
| `MovieGrid` | Unitario |
| `MovieDetail` | Unitario (con mock de Axios y React Router) |

**Decisiones destacadas:**

- **Mocks aislados por endpoint**: en `MovieDetail` y `App`, `axios.get` se mockea distinguiendo la respuesta según la URL solicitada (detalle, créditos, similares, vídeos), en vez de un mock genérico único.
- **Tests de integración reales**: `App.test.tsx` no mockea los componentes hijos (`SearchBar`, `MovieGrid`, `Pagination`); los renderiza de verdad para comprobar el flujo completo tal y como lo vive el usuario.
- **Fake timers para el debounce**: la búsqueda espera 500ms antes de lanzar la petición; los tests usan `vi.useFakeTimers()` para simular ese tiempo sin ralentizar la suite.
- **Navegación mockeada de forma aislada**: `useNavigate` se mockea con `vi.hoisted()` para verificar redirecciones (por ejemplo, al hacer clic en una película similar) sin depender del router real.

### Ejecutar los tests

```bash
npm run test

npm run test:watch

npm run test:coverage
```

---

## Instalación local

```bash
# 1. Clona el repositorio
git clone https://github.com/mariamv13/moviefinder.git
cd moviefinder

# 2. Instala las dependencias
npm install

# 3. Crea el archivo .env con tu API key de TMDB
cp .env.example .env
# Edita .env y añade tu clave

# 4. Arranca el servidor de desarrollo
npm run dev

# (Opcional) Comprueba el tipado
npm run typecheck
```

Accede a `http://localhost:5173`

---

## Autora

**María Martín Vélez** · [GitHub](https://github.com/mariamv13) · [LinkedIn](https://www.linkedin.com/in/maría-martín-vélez-50001b40a/)