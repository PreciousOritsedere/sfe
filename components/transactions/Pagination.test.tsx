import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination, type PaginationProps } from './Pagination'

function setup(props: Partial<PaginationProps> = {}) {
  const onPageChange = vi.fn()
  render(
    <Pagination page={1} totalPages={12} total={237} pageSize={20} onPageChange={onPageChange} {...props} />
  )
  return { onPageChange, user: userEvent.setup() }
}

describe('Pagination', () => {
  it('shows the range and marks the current page', () => {
    setup({ page: 12 })

    expect(screen.getByText('Showing 221–237 of 237')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Page 12' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Page 11' })).not.toHaveAttribute('aria-current')
  })

  it.each([
    [1, true, false],
    [12, false, true],
  ])('on page %i, Previous disabled: %s, Next disabled: %s', (page, previousDisabled, nextDisabled) => {
    setup({ page })

    expect(screen.getByRole('button', { name: 'Previous page' }).hasAttribute('disabled')).toBe(
      previousDisabled
    )
    expect(screen.getByRole('button', { name: 'Next page' }).hasAttribute('disabled')).toBe(nextDisabled)
  })

  it('moves between pages', async () => {
    const { onPageChange, user } = setup({ page: 6 })

    await user.click(screen.getByRole('button', { name: 'Previous page' }))
    await user.click(screen.getByRole('button', { name: 'Next page' }))
    await user.click(screen.getByRole('button', { name: 'Page 12' }))

    expect(onPageChange.mock.calls).toEqual([[5], [7], [12]])
  })

  it('renders nothing when everything fits on one page', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} total={4} pageSize={20} onPageChange={vi.fn()} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
