import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from './Pagination'

describe('Pagination', () => {
  it('renders the current page and total pages', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />)

    expect(screen.getByText('Página 2 de 5')).toBeInTheDocument()
  })

  it('disables the "Anterior" button on the first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />)

    expect(screen.getByRole('button', { name: '← Anterior' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Siguiente →' })).toBeEnabled()
  })

  it('disables the "Siguiente" button on the last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />)

    expect(screen.getByRole('button', { name: 'Siguiente →' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '← Anterior' })).toBeEnabled()
  })

  it('does not disable either button when there is more than one page and we are in the middle', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />)

    expect(screen.getByRole('button', { name: '← Anterior' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Siguiente →' })).toBeEnabled()
  })

  it('calls onPageChange with currentPage - 1 when clicking "Anterior"', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: '← Anterior' }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with currentPage + 1 when clicking "Siguiente"', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Siguiente →' }))

    expect(onPageChange).toHaveBeenCalledWith(4)
  })
})