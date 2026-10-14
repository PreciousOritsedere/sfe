'use client'

import { useEffect } from 'react'
import { hasActiveFilters } from '@/lib/transactions/filters'
import { PAGE_SIZE, useTransactions } from '@/lib/transactions/queries'
import { useTransactionFilters } from '@/lib/transactions/useTransactionFilters'
import { FilterBar } from './FilterBar'
import { Pagination } from './Pagination'
import { TransactionList } from './TransactionList'
import styles from './TransactionsView.module.css'

const plural = (count: number, noun: string) =>
  `${count.toLocaleString('en-GB')} ${noun}${count === 1 ? '' : 's'}`

export function TransactionsView() {
  const { filters, setFilters } = useTransactionFilters()
  const { data, isPlaceholderData } = useTransactions(filters)
  const total = data?.meta?.total
  const totalPages = data?.meta?.totalPages

  // A shared or stale link can point past the last page (e.g. after the results shrank).
  useEffect(() => {
    if (!isPlaceholderData && totalPages !== undefined && filters.page > totalPages) {
      setFilters({ page: totalPages }, { history: 'replace' })
    }
  }, [filters.page, totalPages, isPlaceholderData, setFilters])

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

      {total !== undefined && totalPages !== undefined && filters.page <= totalPages && (
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          total={total}
          pageSize={PAGE_SIZE}
          onPageChange={(page) => setFilters({ page })}
        />
      )}
    </div>
  )
}
