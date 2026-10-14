'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { parseFilters, updateSearchParams, type TransactionFilters } from './filters'

export interface SetFiltersOptions {
  /** `replace` updates the URL without adding a Back step (e.g. while typing a search). */
  history?: 'push' | 'replace'
}

/** Transaction filters stored in the URL, so refresh, shared links and Back keep the user's place. */
export function useTransactionFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters = useMemo(() => parseFilters(searchParams), [searchParams])

  const setFilters = useCallback(
    (update: Partial<TransactionFilters>, { history = 'push' }: SetFiltersOptions = {}) => {
      const query = updateSearchParams(new URLSearchParams(searchParams), update).toString()
      router[history](query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  return { filters, setFilters }
}
