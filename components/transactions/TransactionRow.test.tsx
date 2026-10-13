import { render, screen } from '@testing-library/react'
import type { Transaction } from '@/types/api'
import { TransactionRow } from './TransactionRow'

const transaction: Transaction = {
  id: 'txn_1',
  reference: 'ACM-12345678',
  type: 'bill_payment',
  status: 'successful',
  currency: 'NGN',
  amount: 1850000,
  fee: 0,
  narration: 'Bill payment - Ikeja Electric',
  counterparty: null,
  createdAt: '2026-10-05T08:41:00.000Z',
}

describe('TransactionRow', () => {
  it('renders narration markup as plain text', () => {
    const narration = `Bill payment - Spectranet <img src="x" onerror="console.warn('narration rendered as HTML')">`

    const { container } = render(<TransactionRow transaction={{ ...transaction, narration }} />)

    expect(screen.getByText(narration)).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })
})
