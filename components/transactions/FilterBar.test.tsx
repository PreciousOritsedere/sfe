import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DEFAULT_FILTERS, type TransactionFilters } from '@/lib/transactions/filters'
import { FilterBar } from './FilterBar'

function setup(filters: Partial<TransactionFilters> = {}) {
  const onChange = vi.fn()
  const view = render(<FilterBar filters={{ ...DEFAULT_FILTERS, ...filters }} onChange={onChange} />)
  const rerender = (next: Partial<TransactionFilters>) =>
    view.rerender(<FilterBar filters={{ ...DEFAULT_FILTERS, ...next }} onChange={onChange} />)
  return {
    onChange,
    user: userEvent.setup(),
    rerender,
    search: screen.getByRole('textbox', { name: 'Search' }),
  }
}

describe('FilterBar', () => {
  it('searches once typing pauses, adding one history entry for a new search', async () => {
    const { onChange, user, search } = setup()

    await user.type(search, 'netflix')
    expect(onChange).not.toHaveBeenCalled()

    await waitFor(() => expect(onChange).toHaveBeenCalledWith({ q: 'netflix' }, { history: 'push' }))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('replaces the history entry when refining an existing search', async () => {
    const { onChange, user, search } = setup({ q: 'net' })

    await user.type(search, 'flix')

    await waitFor(() => expect(onChange).toHaveBeenCalledWith({ q: 'netflix' }, { history: 'replace' }))
  })

  it('searches straight away on Enter', async () => {
    const { onChange, user, search } = setup()

    await user.type(search, 'uber{Enter}')

    expect(onChange).toHaveBeenCalledWith({ q: 'uber' }, { history: 'push' })
  })

  it('filters by type and status', async () => {
    const { onChange, user } = setup()

    await user.click(screen.getByRole('combobox', { name: 'Type' }))
    await user.click(screen.getByRole('option', { name: 'Card payment' }))
    await user.click(screen.getByRole('combobox', { name: 'Status' }))

    expect(screen.queryByRole('option', { name: 'Reversed' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Failed' }))

    expect(onChange).toHaveBeenCalledWith({ type: 'card_payment' })
    expect(onChange).toHaveBeenCalledWith({ status: 'failed' })
  })

  it('shows "Clear filters" only when something is filtered, and clears everything', async () => {
    const { onChange, user, rerender } = setup()
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()

    rerender({ q: 'uber', status: 'pending' })
    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(onChange).toHaveBeenCalledWith({ q: '', type: '', status: '' })
  })

  it('follows search changes from the URL, e.g. after Back', () => {
    const { search, rerender } = setup({ q: 'uber' })
    expect(search).toHaveValue('uber')

    rerender({ q: 'netflix' })

    expect(search).toHaveValue('netflix')
  })

  it('keeps what is being typed while the URL catches up', async () => {
    const { onChange, user, search, rerender } = setup()

    await user.type(search, 'red')
    await waitFor(() => expect(onChange).toHaveBeenCalledWith({ q: 'red' }, { history: 'push' }))
    await user.type(search, ' bull')
    rerender({ q: 'red' })

    expect(search).toHaveValue('red bull')
    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith({ q: 'red bull' }, { history: 'replace' }))
  })
})
