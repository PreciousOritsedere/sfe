import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApiError } from '@/lib/api/client'
import { getTransactions } from '@/lib/api/endpoints'
import type { Transaction } from '@/types/api'
import { TransactionsView } from './TransactionsView'

vi.mock('@/lib/api/endpoints', () => ({ getTransactions: vi.fn(), getTransaction: vi.fn() }))

const router = { push: vi.fn(), replace: vi.fn() }
let search = ''
vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/transactions',
  useSearchParams: () => new URLSearchParams(search),
}))

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
  createdAt: new Date().toISOString(),
}

const response = (data: Transaction[], total = data.length) => ({
  data,
  meta: { page: 1, limit: 20, total, totalPages: Math.max(1, Math.ceil(total / 20)) },
})

function renderView(query = '') {
  search = query
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <TransactionsView />
    </QueryClientProvider>
  )
  return userEvent.setup()
}

beforeEach(() => {
  vi.mocked(getTransactions).mockReset()
  router.push.mockReset()
  router.replace.mockReset()
})

describe('TransactionsView', () => {
  it('shows a skeleton, then the transactions and their count', async () => {
    vi.mocked(getTransactions).mockResolvedValue(response([tx], 237))
    renderView()

    expect(screen.getByRole('status')).toHaveTextContent('Loading transactions…')

    expect(await screen.findByText('Wallet top-up')).toBeInTheDocument()
    expect(screen.getByText('237 transactions')).toBeInTheDocument()
  })

  it('shows an error with a working "Try again"', async () => {
    vi.mocked(getTransactions)
      .mockRejectedValueOnce(new ApiError(500, 'INTERNAL_ERROR', 'Boom'))
      .mockResolvedValueOnce(response([tx]))
    const user = renderView()

    expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t load your transactions')
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText('Wallet top-up')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('offers to clear filters when nothing matches', async () => {
    vi.mocked(getTransactions).mockResolvedValue(response([]))
    const user = renderView('q=zzz&status=failed')

    expect(await screen.findByText('No transactions match your filters')).toBeInTheDocument()
    expect(screen.getByText('0 results')).toBeInTheDocument()

    const clearButtons = screen.getAllByRole('button', { name: 'Clear filters' })
    await user.click(clearButtons[clearButtons.length - 1])

    expect(router.push).toHaveBeenCalledWith('/transactions', { scroll: false })
  })

  it('explains when there are no transactions at all', async () => {
    vi.mocked(getTransactions).mockResolvedValue(response([]))
    renderView()

    expect(await screen.findByText('No transactions yet')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument()
  })

  it('moves a page past the end to the last page without adding a Back step', async () => {
    vi.mocked(getTransactions).mockResolvedValue({
      data: [],
      meta: { page: 99, limit: 20, total: 237, totalPages: 12 },
    })
    renderView('page=99')

    await vi.waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith('/transactions?page=12', { scroll: false })
    )
    expect(screen.queryByText('No transactions yet')).not.toBeInTheDocument()
    expect(router.push).not.toHaveBeenCalled()
  })
})
