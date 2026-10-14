'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'
import { Button, Card, EmptyState } from '@/components/ui'
import { cx } from '@/lib/cx'
import { hasActiveFilters } from '@/lib/transactions/filters'
import { PAGE_SIZE, useTransactions } from '@/lib/transactions/queries'
import { useTransactionFilters } from '@/lib/transactions/useTransactionFilters'
import type { Transaction } from '@/types/api'
import { FilterBar } from './FilterBar'
import { Pagination } from './Pagination'
import { TransactionDrawer } from './TransactionDrawer'
import { TransactionList } from './TransactionList'
import { TransactionListSkeleton } from './TransactionListSkeleton'
import styles from './TransactionsView.module.css'

const plural = (count: number, noun: string) =>
  `${count.toLocaleString('en-GB')} ${noun}${count === 1 ? '' : 's'}`

function Header({ subtitle }: { subtitle?: string }) {
  return (
    <header>
      <h1 className={styles.title}>Transactions</h1>
      <p className={styles.subtitle} aria-live="polite">
        {subtitle}
      </p>
    </header>
  )
}

/** Shown until the page can read the URL (before JavaScript loads). */
export function TransactionsViewFallback() {
  return (
    <div className={styles.page}>
      <Header />
      <TransactionListSkeleton />
    </div>
  )
}

export function TransactionsView() {
  const router = useRouter()
  const { filters, setFilters } = useTransactionFilters()
  const { data, isError, isFetching, isPlaceholderData, refetch } = useTransactions(filters)
  const isFiltered = hasActiveFilters(filters)
  const total = data?.meta?.total
  const totalPages = data?.meta?.totalPages
  // Treated as loading: the effect below moves to the last page.
  const isPastLastPage = totalPages !== undefined && filters.page > totalPages

  // A shared or stale link can point past the last page (e.g. after the results shrank).
  useEffect(() => {
    if (!isPlaceholderData && totalPages !== undefined && filters.page > totalPages) {
      setFilters({ page: totalPages }, { history: 'replace' })
    }
  }, [filters.page, totalPages, isPlaceholderData, setFilters])

  const clearFilters = () => setFilters({ q: '', type: '', status: '' })
  const changePage = (page: number) => {
    setFilters({ page })
    window.scrollTo({ top: 0 })
  }

  // Opening from a row adds a Back step, so closing steps back rather than adding another entry.
  // A drawer opened from a shared link has nothing to step back to, so closing just drops `txn`.
  const openedFromList = useRef(false)
  const openDetails = (transaction: Transaction) => {
    openedFromList.current = true
    setFilters({ txn: transaction.id })
  }
  const closeDetails = () => {
    if (openedFromList.current) {
      openedFromList.current = false
      router.back()
    } else {
      setFilters({ txn: null }, { history: 'replace' })
    }
  }

  let results: ReactNode
  if (isError && !data && !isFetching) {
    results = (
      <Card padding="none" as="div">
        <EmptyState
          role="alert"
          icon="alert"
          tone="danger"
          title="We couldn’t load your transactions"
          description="Check your connection and try again."
          action={
            <Button size="sm" iconLeft="refresh" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      </Card>
    )
  } else if (!data || isPastLastPage) {
    results = <TransactionListSkeleton />
  } else if (data.data.length === 0) {
    results = (
      <Card padding="none" as="div">
        {isFiltered ? (
          <EmptyState
            icon="search"
            title="No transactions match your filters"
            description="Try a different search term or remove some filters."
            action={
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon="inbox"
            title="No transactions yet"
            description="When you add money, send a transfer or pay with your card, it will show up here."
          />
        )}
      </Card>
    )
  } else {
    results = (
      <div className={cx(styles.results, isPlaceholderData && styles.stale)} aria-busy={isPlaceholderData}>
        <TransactionList transactions={data.data} onSelect={openDetails} />
      </div>
    )
  }

  const showCount = total !== undefined && !isPastLastPage

  return (
    <div className={styles.page}>
      <Header subtitle={showCount ? plural(total, isFiltered ? 'result' : 'transaction') : undefined} />

      <FilterBar filters={filters} onChange={setFilters} />

      {results}

      {data && totalPages !== undefined && total !== undefined && !isPastLastPage && (
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          total={total}
          pageSize={PAGE_SIZE}
          onPageChange={changePage}
        />
      )}

      <TransactionDrawer transactionId={filters.txn} onClose={closeDetails} />
    </div>
  )
}
