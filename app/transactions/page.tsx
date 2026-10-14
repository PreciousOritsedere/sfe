import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TransactionsView, TransactionsViewFallback } from '@/components/transactions'

export const metadata: Metadata = { title: 'Transactions' }

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsViewFallback />}>
      <TransactionsView />
    </Suspense>
  )
}
