import { render, screen } from '@testing-library/react'
import { Navbar } from './Navbar'

const pathname = vi.hoisted(() => ({ current: '/' }))

vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }))
vi.mock('./UserMenu', () => ({ UserMenu: () => null }))

describe('Navbar', () => {
  it.each([
    ['/', 'Dashboard'],
    ['/transactions', 'Transactions'],
    ['/convert', 'Convert'],
  ])('marks the link for %s as the current page', (path, label) => {
    pathname.current = path
    render(<Navbar />)

    expect(screen.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByRole('link', { current: 'page' })).toHaveLength(1)
  })

  it('keeps the section active on nested routes', () => {
    pathname.current = '/transactions/txn_255s'
    render(<Navbar />)

    expect(screen.getByRole('link', { name: 'Transactions' })).toHaveAttribute('aria-current', 'page')
  })
})
