import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ApiError, isNotFound } from '@/lib/api/client'
import { getTransaction, getTransactions } from '@/lib/api/endpoints'
import type { Transaction } from '@/types/api'
import { DEFAULT_FILTERS } from './filters'
import { useTransaction, useTransactions } from './queries'

vi.mock('@/lib/api/endpoints', () => ({ getTransactions: vi.fn(), getTransaction: vi.fn() }))

const tx: Transaction = {
  id: 'txn_1',
  reference: 'ACM-1',
  type: 'deposit',
  status: 'successful',
  currency: 'NGN',
  amount: 100_00,
  fee: 0,
  narration: 'Wallet top-up',
  counterparty: null,
  createdAt: '2026-10-13T09:00:00.000Z',
}

const pageOf = (data: Transaction[], page = 1) => ({
  data,
  meta: { page, limit: 20, total: 40, totalPages: 2 },
})

function setup() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 30_000 } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return { queryClient, wrapper }
}

beforeEach(() => {
  vi.mocked(getTransactions).mockReset()
  vi.mocked(getTransaction).mockReset()
})

describe('useTransactions', () => {
  it('requests one page of 20, leaving out empty filters', async () => {
    vi.mocked(getTransactions).mockResolvedValue(pageOf([tx]))
    const { wrapper } = setup()

    const { result } = renderHook(
      () => useTransactions({ ...DEFAULT_FILTERS, q: '  uber ', status: 'failed' }),
      {
        wrapper,
      }
    )

    await waitFor(() => expect(result.current.data?.data).toEqual([tx]))
    expect(getTransactions).toHaveBeenCalledWith(
      { q: 'uber', type: undefined, status: 'failed', page: 1, limit: 20 },
      { signal: expect.any(AbortSignal) }
    )
  })

  it('keeps the previous page on screen while the next one loads', async () => {
    vi.mocked(getTransactions)
      .mockResolvedValueOnce(pageOf([tx]))
      .mockReturnValueOnce(new Promise(() => {}))
    const { wrapper } = setup()

    const { result, rerender } = renderHook((page: number) => useTransactions({ ...DEFAULT_FILTERS, page }), {
      wrapper,
      initialProps: 1,
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    rerender(2)

    await waitFor(() => expect(getTransactions).toHaveBeenCalledTimes(2))
    expect(result.current.isPlaceholderData).toBe(true)
    expect(result.current.data?.data).toEqual([tx])
  })
})

describe('useTransaction', () => {
  it('uses a transaction from a loaded list without fetching it again', () => {
    const { queryClient, wrapper } = setup()
    queryClient.setQueryData(['transactions', 'list', { page: 1, limit: 20 }], pageOf([tx]))

    const { result } = renderHook(() => useTransaction('txn_1'), { wrapper })

    expect(result.current.data).toEqual(tx)
    expect(getTransaction).not.toHaveBeenCalled()
  })

  it('fetches a transaction that is not in any list', async () => {
    vi.mocked(getTransaction).mockResolvedValue({ data: tx })
    const { wrapper } = setup()

    const { result } = renderHook(() => useTransaction('txn_1'), { wrapper })

    await waitFor(() => expect(result.current.data).toEqual(tx))
    expect(getTransaction).toHaveBeenCalledWith('txn_1', { signal: expect.any(AbortSignal) })
  })

  it('reports a missing transaction as not found', async () => {
    vi.mocked(getTransaction).mockRejectedValue(new ApiError(404, 'NOT_FOUND', 'Transaction txn_x not found'))
    const { wrapper } = setup()

    const { result } = renderHook(() => useTransaction('txn_x'), { wrapper })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(isNotFound(result.current.error)).toBe(true)
  })

  it('does nothing when no transaction is open', () => {
    const { wrapper } = setup()

    const { result } = renderHook(() => useTransaction(null), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(getTransaction).not.toHaveBeenCalled()
  })
})
