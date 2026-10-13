'use client'

import { useTransactions } from '@/lib/transactions/queries'
import { useTransactionFilters } from '@/lib/transactions/useTransactionFilters'
import { TransactionList } from './TransactionList'
import styles from './TransactionsView.module.css'

const plural = (count: number, noun: string) =>
  `${count.toLocaleString('en-GB')} ${noun}${count === 1 ? '' : 's'}`

export function TransactionsView() {
  const { filters } = useTransactionFilters()
  const { data } = useTransactions(filters)
  const isFiltered = Boolean(filters.q.trim() || filters.type || filters.status)
  const total = data?.meta?.total

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Transactions</h1>
        <p className={styles.subtitle}>
          {total !== undefined && plural(total, isFiltered ? 'result' : 'transaction')}
        </p>
      </header>

      {data && <TransactionList transactions={data.data} />}
    </div>
  )
}
