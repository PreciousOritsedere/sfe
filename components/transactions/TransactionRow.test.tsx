import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Transaction } from '@/types/api'
import { TransactionRow } from './TransactionRow'

const transaction: Transaction = {
  id: 'txn_1',
  reference: 'ACM-12345678',
  type: 'bill_payment',
  status: 'failed',
  currency: 'NGN',
  amount: 1850000,
  fee: 0,
  narration: 'Bill payment - Ikeja Electric',
  counterparty: null,
  createdAt: '2026-10-05T08:41:00.000Z',
}

const transfer: Transaction = {
  ...transaction,
  id: 'txn_2',
  type: 'transfer_in',
  status: 'pending',
  amount: 2500000,
  narration: 'Transfer from Ada Okafor',
  counterparty: 'Ada Okafor',
}

describe('TransactionRow', () => {
  it('renders narration markup as plain text', () => {
    const narration = `Bill payment - Spectranet <img src="x" onerror="console.warn('narration rendered as HTML')">`

    const { container } = render(<TransactionRow transaction={{ ...transaction, narration }} />)

    expect(screen.getByText(narration)).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })

  it('shows the type, status and a signed amount', () => {
    render(<TransactionRow transaction={transaction} />)

    expect(screen.getByText('Bill payment')).toBeInTheDocument()
    expect(screen.getByText('Failed')).toBeInTheDocument()
    expect(screen.getByText('−₦18,500.00')).toBeInTheDocument()
  })

  it('shows counterparty initials and a credit amount for incoming transfers', () => {
    render(<TransactionRow transaction={transfer} />)

    expect(screen.getByText('AO')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('+₦25,000.00')).toBeInTheDocument()
  })

  it('shows the date by default and only the time when grouped by day', () => {
    const { rerender } = render(<TransactionRow transaction={transaction} />)
    expect(screen.getByRole('button')).toHaveTextContent('2026')

    rerender(<TransactionRow transaction={transaction} timestamp="time" />)
    expect(screen.getByRole('button')).not.toHaveTextContent('2026')
  })

  it('reports the selected transaction', async () => {
    const onSelect = vi.fn()
    render(<TransactionRow transaction={transfer} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button'))

    expect(onSelect).toHaveBeenCalledWith(transfer)
  })
})
