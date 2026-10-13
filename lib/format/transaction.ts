import type { TransactionStatus, TransactionType } from '@/types/api'

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  transfer_in: 'Transfer in',
  transfer_out: 'Transfer out',
  conversion: 'Conversion',
  card_payment: 'Card payment',
  bill_payment: 'Bill payment',
}

const CREDIT_TYPES: readonly TransactionType[] = ['deposit', 'transfer_in', 'conversion']

/** Money coming into the wallet. Conversions are shown as the amount received. */
export const isCredit = (type: TransactionType) => CREDIT_TYPES.includes(type)

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  successful: 'Successful',
  pending: 'Pending',
  failed: 'Failed',
}
