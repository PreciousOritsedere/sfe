'use client'

import { Button, Drawer, EmptyState } from '@/components/ui'
import { isNotFound } from '@/lib/api/client'
import { useTransaction } from '@/lib/transactions/queries'
import { TransactionDetails, TransactionDetailsSkeleton } from './TransactionDetails'

export interface TransactionDrawerProps {
  /** Id of the transaction to show; `null` when closed. */
  transactionId: string | null
  onClose: () => void
}

/** Transaction details, loaded by id so the drawer also works when opened from a shared link. */
export function TransactionDrawer({ transactionId, onClose }: TransactionDrawerProps) {
  const { data, error, isError, isFetching, refetch } = useTransaction(transactionId)

  let body
  if (data) {
    body = <TransactionDetails transaction={data} />
  } else if (isError && isNotFound(error)) {
    body = (
      <EmptyState
        icon="search"
        title="Transaction not found"
        description="It may have been removed, or the link is wrong."
        action={
          <Button variant="secondary" size="sm" onClick={onClose}>
            Back to transactions
          </Button>
        }
      />
    )
  } else if (isError && !isFetching) {
    body = (
      <EmptyState
        role="alert"
        icon="alert"
        tone="danger"
        title="We couldn’t load this transaction"
        description="Check your connection and try again."
        action={
          <Button size="sm" iconLeft="refresh" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  } else {
    body = <TransactionDetailsSkeleton />
  }

  return (
    <Drawer open={transactionId !== null} title="Transaction details" onClose={onClose}>
      {body}
    </Drawer>
  )
}
