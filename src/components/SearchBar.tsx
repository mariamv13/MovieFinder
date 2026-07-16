interface SearchBarProps {
  query: string
  onQueryChange: (value: string) => void
}

function SearchBar({ query, onQueryChange }: SearchBarProps) {
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