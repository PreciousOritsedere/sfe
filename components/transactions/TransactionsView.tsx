'use client'

import { hasActiveFilters } from '@/lib/transactions/filters'
import { useTransactions } from '@/lib/transactions/queries'
import { useTransactionFilters } from '@/lib/transactions/useTransactionFilters'
import { FilterBar } from './FilterBar'
import { TransactionList } from './TransactionList'
import styles from './TransactionsView.module.css'

const plural = (count: number, noun: string) =>
  `${count.toLocaleString('en-GB')} ${noun}${count === 1 ? '' : 's'}`

export function TransactionsView() {
  const { filters, setFilters } = useTransactionFilters()
  const { data } = useTransactions(filters)
  const total = data?.meta?.total

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Transactions</h1>
        <p className={styles.subtitle}>
          {total !== undefined && plural(total, hasActiveFilters(filters) ? 'result' : 'transaction')}
        </p>
      </header>

      <FilterBar filters={filters} onChange={setFilters} />

      {data && <TransactionList transactions={data.data} />}
    </div>
  )
}
