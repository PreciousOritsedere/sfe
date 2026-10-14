import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApiError } from '@/lib/api/client'
import { getTransaction } from '@/lib/api/endpoints'
import type { Transaction } from '@/types/api'
import { TransactionDrawer } from './TransactionDrawer'

vi.mock('@/lib/api/endpoints', () => ({ getTransactions: vi.fn(), getTransaction: vi.fn() }))

const tx: Transaction = {
  id: 'txn_255s',
  reference: 'ACM-48213377',
  type: 'transfer_out',
  status: 'successful',
  currency: 'GHS',
  amount: 1_200_00,
  fee: 12_00,
  narration: 'Transfer to Kwame Mensah',
  counterparty: 'Kwame Mensah',
  createdAt: '2026-10-05T10:15:00.000Z',
}

function renderDrawer(transactionId: string | null = tx.id) {
  const onClose = vi.fn()
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const user = userEvent.setup()
  render(
    <QueryClientProvider client={queryClient}>
      <TransactionDrawer transactionId={transactionId} onClose={onClose} />
    </QueryClientProvider>
  )
  return { onClose, user }
}

beforeEach(() => {
  vi.mocked(getTransaction).mockReset()
})

describe('TransactionDrawer', () => {
  it('shows a skeleton, then the details and summary', async () => {
    vi.mocked(getTransaction).mockResolvedValue({ data: tx })
    renderDrawer()

    const dialog = screen.getByRole('dialog', { name: 'Transaction details' })
    expect(within(dialog).getByRole('status')).toHaveTextContent('Loading transaction…')

    expect(await within(dialog).findByText('Transfer out to Kwame Mensah')).toBeInTheDocument()
    expect(within(dialog).getByText('−GH₵1,200.00')).toBeInTheDocument()
    expect(within(dialog).getByText('ACM-48213377')).toBeInTheDocument()
    expect(within(dialog).getByText('GH₵12.00')).toBeInTheDocument()
    expect(within(dialog).getByText('GH₵1,212.00')).toBeInTheDocument()
  })

  it('copies the reference and confirms it', async () => {
    vi.mocked(getTransaction).mockResolvedValue({ data: tx })
    const { user } = renderDrawer()

    await user.click(await screen.findByRole('button', { name: 'Copy reference' }))

    expect(await navigator.clipboard.readText()).toBe('ACM-48213377')
    expect(screen.getByText('Copied')).toBeInTheDocument()
  })

  it('explains a missing transaction and offers a way back', async () => {
    vi.mocked(getTransaction).mockRejectedValue(new ApiError(404, 'NOT_FOUND', 'Transaction txn_x not found'))
    const { onClose, user } = renderDrawer('txn_x')

    expect(await screen.findByText('Transaction not found')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Back to transactions' }))

    expect(onClose).toHaveBeenCalled()
  })

  it('shows an error with a working "Try again"', async () => {
    vi.mocked(getTransaction)
      .mockRejectedValueOnce(new ApiError(500, 'INTERNAL_ERROR', 'Boom'))
      .mockResolvedValueOnce({ data: tx })
    const { user } = renderDrawer()

    expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t load this transaction')
    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(await screen.findByText('Transfer out to Kwame Mensah')).toBeInTheDocument()
  })

  it('is closed when no transaction is selected', () => {
    renderDrawer(null)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(getTransaction).not.toHaveBeenCalled()
  })
})
