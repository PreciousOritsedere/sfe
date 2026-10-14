import type { Currency } from '@/types/api'
import { cx } from '@/lib/cx'
import { formatMoney } from '@/lib/format'
import styles from './Money.module.css'

const SIGN_PREFIX = { credit: '+', debit: '−' } as const

export interface MoneyProps {
  /** Minor units. */
  amount: number
  currency: Currency
  /** Prefix with + or −. */
  sign?: 'credit' | 'debit'
  className?: string
}

export function Money({ amount, currency, sign, className }: MoneyProps) {
  return (
    <span className={cx(styles.money, className)}>
      {sign && SIGN_PREFIX[sign]}
      {formatMoney(amount, currency)}
    </span>
  )
}
