import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TransactionsView } from '@/components/transactions'

export const metadata: Metadata = { title: 'Transactions' }

export default function TransactionsPage() {
  return (
    <Suspense>
      <TransactionsView />
    </Suspense>
  )
}
