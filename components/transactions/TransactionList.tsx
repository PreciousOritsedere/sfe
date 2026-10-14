import { groupByDay } from '@/lib/transactions/groupByDay'
import type { Transaction } from '@/types/api'
import { TransactionRow } from './TransactionRow'
import styles from './TransactionList.module.css'

export interface TransactionListProps {
  transactions: readonly Transaction[]
  onSelect?: (transaction: Transaction) => void
}

export function TransactionList({ transactions, onSelect }: TransactionListProps) {
  return (
    <div className={styles.list}>
      {groupByDay(transactions).map((group) => (
        <section key={group.key} className={styles.group} aria-labelledby={`day-${group.key}`}>
          <h2 id={`day-${group.key}`} className={styles.day}>
            {group.label}
          </h2>
          <ul className={styles.items}>
            {group.transactions.map((tx) => (
              <li key={tx.id}>
                <TransactionRow transaction={tx} onSelect={onSelect} timestamp="time" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
