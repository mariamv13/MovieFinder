import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('shows the current query value in the input', () => {
    render(<SearchBar query="matrix" onQueryChange={() => {}} />)

    expect(screen.getByPlaceholderText('Busca una película...')).toHaveValue('matrix')
  })

  it('calls onQueryChange with the typed text', async () => {
    const user = userEvent.setup()
    const onQueryChange = vi.fn()
    render(<SearchBar query="" onQueryChange={onQueryChange} />)

    await user.type(screen.getByPlaceholderText('Busca una película...'), 'dune')

    expect(onQueryChange).toHaveBeenCalledTimes(4)
    expect(onQueryChange).toHaveBeenLastCalledWith('e')
  })
})