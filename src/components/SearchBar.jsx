// Buscador

function SearchBar({ query, onQueryChange }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Busca una película..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
            />
        </div>
    )
}

export default SearchBar