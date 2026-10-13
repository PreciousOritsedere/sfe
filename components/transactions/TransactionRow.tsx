import type { Transaction } from '@/types/api'
import { Money } from '@/components/ui'
import { formatDateTime, formatTime, isCredit, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { cx } from '@/lib/cx'
import { StatusBadge } from './StatusBadge'
import { TransactionAvatar } from './TransactionAvatar'
import styles from './TransactionRow.module.css'

export interface TransactionRowProps {
  transaction: Transaction
  onSelect?: (transaction: Transaction) => void
  /** Use `time` when rows are already grouped under a date heading. */
  timestamp?: 'datetime' | 'time'
}

export function TransactionRow({ transaction: tx, onSelect, timestamp = 'datetime' }: TransactionRowProps) {
  const credit = isCredit(tx.type)

  return (
    <button type="button" className={styles.row} onClick={() => onSelect?.(tx)}>
      <span className={cx(styles.grid, timestamp === 'time' && styles.timeOnly)}>
        <TransactionAvatar transaction={tx} className={styles.avatar} />
        <span className={styles.main}>
          <span className={styles.title}>{TRANSACTION_TYPE_LABELS[tx.type]}</span>
          <span className={styles.narration}>{tx.narration}</span>
        </span>
        <StatusBadge status={tx.status} className={styles.status} />
        <Money
          amount={tx.amount}
          currency={tx.currency}
          sign={credit ? 'credit' : 'debit'}
          className={cx(styles.amount, credit && styles.credit)}
        />
        <time className={styles.meta} dateTime={tx.createdAt}>
          {timestamp === 'time' ? formatTime(tx.createdAt) : formatDateTime(tx.createdAt)}
        </time>
      </span>
    </button>
  )
}
