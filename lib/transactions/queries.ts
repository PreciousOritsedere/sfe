'use client'

import {
  keepPreviousData,
  skipToken,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import { getTransaction, getTransactions, type TransactionQuery } from '@/lib/api/endpoints'
import type { ApiSuccess, Transaction } from '@/types/api'
import type { TransactionFilters } from './filters'

export const PAGE_SIZE = 20

export const transactionKeys = {
  lists: () => ['transactions', 'list'] as const,
  list: (query: TransactionQuery) => [...transactionKeys.lists(), query] as const,
  detail: (id: string) => ['transactions', 'detail', id] as const,
}

export type ListFilters = Pick<TransactionFilters, 'q' | 'type' | 'status' | 'page'>

/**
 * One page of transactions. While the next page or filter loads, the previous results stay on screen
 * (`isPlaceholderData` is true). Superseded requests are cancelled.
 */
export function useTransactions({ q, type, status, page }: ListFilters) {
  const query: TransactionQuery = {
    q: q.trim() || undefined,
    type: type || undefined,
    status: status || undefined,
    page,
    limit: PAGE_SIZE,
  }

  return useQuery({
    queryKey: transactionKeys.list(query),
    queryFn: ({ signal }) => getTransactions(query, { signal }),
    placeholderData: keepPreviousData,
  })
}

function findInLists(queryClient: QueryClient, id: string) {
  for (const query of queryClient.getQueryCache().findAll({ queryKey: transactionKeys.lists() })) {
    const transaction = (query.state.data as ApiSuccess<Transaction[]> | undefined)?.data.find(
      (t) => t.id === id
    )
    if (transaction) return { transaction, updatedAt: query.state.dataUpdatedAt }
  }
}

/**
 * A single transaction. Shows the copy from an already loaded list straight away; fetches it when opened
 * from a link. Pass `null` when nothing is open. A 404 is reported as an error; check it with `isNotFound`.
 */
export function useTransaction(id: string | null) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: transactionKeys.detail(id ?? ''),
    queryFn: id ? ({ signal }) => getTransaction(id, { signal }).then((res) => res.data) : skipToken,
    initialData: () => (id ? findInLists(queryClient, id)?.transaction : undefined),
    initialDataUpdatedAt: () => (id ? findInLists(queryClient, id)?.updatedAt : undefined),
  })
}
