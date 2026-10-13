'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Button, Input, Select, type SelectOption } from '@/components/ui'
import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { hasActiveFilters, type TransactionFilters } from '@/lib/transactions/filters'
import type { SetFiltersOptions } from '@/lib/transactions/useTransactionFilters'
import type { TransactionStatus, TransactionType } from '@/types/api'
import styles from './FilterBar.module.css'

const SEARCH_DEBOUNCE_MS = 300

const TYPE_OPTIONS: readonly SelectOption<TransactionType | ''>[] = [
  { value: '', label: 'All types' },
  ...Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => ({
    value: value as TransactionType,
    label,
  })),
]

const STATUS_OPTIONS: readonly SelectOption<TransactionStatus | ''>[] = [
  { value: '', label: 'All statuses' },
  ...Object.entries(TRANSACTION_STATUS_LABELS).map(([value, label]) => ({
    value: value as TransactionStatus,
    label,
  })),
]

export interface FilterBarProps {
  filters: TransactionFilters
  onChange: (update: Partial<TransactionFilters>, options?: SetFiltersOptions) => void
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [text, setText] = useState(filters.q)
  const [syncedQ, setSyncedQ] = useState(filters.q)
  const [sentQ, setSentQ] = useState<string | null>(null)

  // Follow the URL when the search changes from outside (Back, refresh, Clear filters), but not when the
  // URL is catching up with what was just typed.
  if (filters.q !== syncedQ) {
    setSyncedQ(filters.q)
    if (filters.q !== sentQ) {
      setText(filters.q)
      setSentQ(null)
    }
  }

  // Starting a search adds one Back step; refining it while typing doesn't add more.
  const applySearch = useCallback(
    (q: string) => {
      setSentQ(q)
      onChange({ q }, { history: filters.q.trim() ? 'replace' : 'push' })
    },
    [filters.q, onChange]
  )

  useEffect(() => {
    if (text.trim() === filters.q.trim()) return
    const timer = setTimeout(() => applySearch(text), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [text, filters.q, applySearch])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (text.trim() !== filters.q.trim()) applySearch(text)
  }

  const clear = () => {
    setText('')
    onChange({ q: '', type: '', status: '' })
  }

  return (
    <form role="search" className={styles.bar} onSubmit={handleSubmit}>
      <Input
        label="Search"
        leadingIcon="search"
        placeholder="Search by reference, name or narration"
        value={text}
        onChange={(event) => setText(event.target.value)}
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        fieldClassName={styles.search}
      />
      <Select
        label="Type"
        options={TYPE_OPTIONS}
        value={filters.type}
        onValueChange={(type) => onChange({ type })}
        fieldClassName={styles.select}
      />
      <Select
        label="Status"
        options={STATUS_OPTIONS}
        value={filters.status}
        onValueChange={(status) => onChange({ status })}
        fieldClassName={styles.select}
      />
      {(hasActiveFilters(filters) || text.trim() !== '') && (
        <Button variant="ghost" className={styles.clear} onClick={clear}>
          Clear filters
        </Button>
      )}
    </form>
  )
}
