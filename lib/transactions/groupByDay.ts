import { formatDate } from '@/lib/format'
import type { Transaction } from '@/types/api'

export interface DayGroup {
  /** Local calendar day, `YYYY-MM-DD`. */
  key: string
  /** "Today", "Yesterday" or e.g. "Mon, 5 Oct 2026". */
  label: string
  transactions: Transaction[]
}

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

/** Groups transactions by the day they happened in the user's timezone, keeping their order. */
export function groupByDay(transactions: readonly Transaction[], now = new Date()): DayGroup[] {
  const today = dayKey(now)
  const yesterday = dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
  const groups = new Map<string, DayGroup>()

  for (const transaction of transactions) {
    const key = dayKey(new Date(transaction.createdAt))
    let group = groups.get(key)
    if (!group) {
      const label =
        key === today ? 'Today' : key === yesterday ? 'Yesterday' : formatDate(transaction.createdAt)
      group = { key, label, transactions: [] }
      groups.set(key, group)
    }
    group.transactions.push(transaction)
  }

  return [...groups.values()]
}
