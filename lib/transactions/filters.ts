import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/format/transaction'
import type { TransactionStatus, TransactionType } from '@/types/api'

export interface TransactionFilters {
  q: string
  /** `''` means all types. */
  type: TransactionType | ''
  /** `''` means all statuses. */
  status: TransactionStatus | ''
  page: number
  /** Id of the transaction open in the details drawer. */
  txn: string | null
}

export const DEFAULT_FILTERS: TransactionFilters = { q: '', type: '', status: '', page: 1, txn: null }

const RESETS_PAGE = ['q', 'type', 'status'] as const

const isType = (value: string): value is TransactionType => Object.hasOwn(TRANSACTION_TYPE_LABELS, value)
const isStatus = (value: string): value is TransactionStatus =>
  Object.hasOwn(TRANSACTION_STATUS_LABELS, value)

function parsePage(value: string | null) {
  const page = Number(value)
  return value && /^\d+$/.test(value) && page >= 1 ? page : DEFAULT_FILTERS.page
}

/** Reads filters from the URL. Missing or invalid values fall back to the defaults. */
export function parseFilters(params: Pick<URLSearchParams, 'get'>): TransactionFilters {
  const type = params.get('type') ?? ''
  const status = params.get('status') ?? ''

  return {
    q: params.get('q') ?? '',
    type: isType(type) ? type : '',
    status: isStatus(status) ? status : '',
    page: parsePage(params.get('page')),
    txn: params.get('txn') || null,
  }
}

/**
 * Returns `current` with `update` applied. Changing the search or a filter goes back to page 1.
 * Defaults are left out of the URL, and unrelated params (e.g. `__scenario`) are kept.
 */
export function updateSearchParams(current: URLSearchParams, update: Partial<TransactionFilters>) {
  const previous = parseFilters(current)
  const next = { ...previous, ...update }
  if (update.page === undefined && RESETS_PAGE.some((key) => next[key] !== previous[key])) {
    next.page = DEFAULT_FILTERS.page
  }

  const params = new URLSearchParams(current)
  setOrDelete(params, 'q', next.q.trim() ? next.q : '')
  setOrDelete(params, 'type', next.type)
  setOrDelete(params, 'status', next.status)
  setOrDelete(params, 'page', next.page === DEFAULT_FILTERS.page ? '' : String(next.page))
  setOrDelete(params, 'txn', next.txn ?? '')
  return params
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value) params.set(key, value)
  else params.delete(key)
}
