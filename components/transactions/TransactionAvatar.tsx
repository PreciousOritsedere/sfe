import type { Transaction, TransactionType } from '@/types/api'
import { Avatar, Icon, type IconName } from '@/components/ui'
import { cx } from '@/lib/cx'
import styles from './TransactionAvatar.module.css'

const TYPE_ICONS: Record<TransactionType, IconName> = {
  deposit: 'arrow-down-left',
  transfer_in: 'arrow-down-left',
  withdrawal: 'arrow-up-right',
  transfer_out: 'arrow-up-right',
  conversion: 'swap',
  card_payment: 'card',
  bill_payment: 'receipt',
}

export interface TransactionAvatarProps {
  transaction: Pick<Transaction, 'type' | 'counterparty'>
  size?: 'md' | 'lg'
  className?: string
}

/** Counterparty initials for transfers, otherwise an icon for the transaction type. Decorative. */
export function TransactionAvatar({ transaction, size = 'md', className }: TransactionAvatarProps) {
  if (transaction.counterparty) {
    return <Avatar src={null} alt="" name={transaction.counterparty} size={size} className={className} />
  }
  return (
    <span className={cx(styles.icon, styles[size], className)} aria-hidden>
      <Icon name={TYPE_ICONS[transaction.type]} size={size === 'lg' ? 20 : 18} />
    </span>
  )
}
