import { act, renderHook } from '@testing-library/react'
import { useTransactionFilters } from './useTransactionFilters'

const router = { push: vi.fn(), replace: vi.fn() }
let search = ''

vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/transactions',
  useSearchParams: () => new URLSearchParams(search),
}))

beforeEach(() => {
  router.push.mockReset()
  router.replace.mockReset()
  search = ''
})

describe('useTransactionFilters', () => {
  it('reads filters from the URL', () => {
    search = 'status=failed&page=2'
    const { result } = renderHook(() => useTransactionFilters())

    expect(result.current.filters).toMatchObject({ status: 'failed', page: 2 })
  })

  it('pushes a history entry by default, without scrolling', () => {
    search = '__scenario=slow&page=3'
    const { result } = renderHook(() => useTransactionFilters())

    act(() => result.current.setFilters({ type: 'deposit' }))

    expect(router.push).toHaveBeenCalledWith('/transactions?__scenario=slow&type=deposit', { scroll: false })
  })

  it('replaces the current entry when asked', () => {
    const { result } = renderHook(() => useTransactionFilters())

    act(() => result.current.setFilters({ q: 'netflix' }, { history: 'replace' }))

    expect(router.replace).toHaveBeenCalledWith('/transactions?q=netflix', { scroll: false })
    expect(router.push).not.toHaveBeenCalled()
  })

  it('navigates to the bare path when every filter is cleared', () => {
    search = 'type=deposit'
    const { result } = renderHook(() => useTransactionFilters())

    act(() => result.current.setFilters({ type: '' }))

    expect(router.push).toHaveBeenCalledWith('/transactions', { scroll: false })
  })
})
