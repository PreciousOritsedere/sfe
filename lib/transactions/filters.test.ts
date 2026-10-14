import { DEFAULT_FILTERS, hasActiveFilters, parseFilters, updateSearchParams } from './filters'

const params = (query: string) => new URLSearchParams(query)

describe('parseFilters', () => {
  it('returns the defaults for an empty URL', () => {
    expect(parseFilters(params(''))).toEqual(DEFAULT_FILTERS)
  })

  it('reads every filter', () => {
    expect(parseFilters(params('q=netflix&type=card_payment&status=pending&page=2&txn=txn_255s'))).toEqual({
      q: 'netflix',
      type: 'card_payment',
      status: 'pending',
      page: 2,
      txn: 'txn_255s',
    })
  })

  it.each(['abc', '0', '-1', '1.5', '2e3', ''])('falls back to page 1 for page=%s', (page) => {
    expect(parseFilters(params(`page=${page}`)).page).toBe(1)
  })

  it('ignores unknown types and statuses', () => {
    const filters = parseFilters(params('type=banana&status=reversed&txn='))

    expect(filters.type).toBe('')
    expect(filters.status).toBe('')
    expect(filters.txn).toBeNull()
  })
})

describe('hasActiveFilters', () => {
  it('is true only for a search, type or status', () => {
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, page: 3, txn: 'txn_1' })).toBe(false)
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, q: '  ' })).toBe(false)
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, q: 'uber' })).toBe(true)
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, status: 'failed' })).toBe(true)
  })
})

describe('updateSearchParams', () => {
  it('round-trips through parseFilters', () => {
    const filters = { q: 'red bull', type: 'deposit', status: 'failed', page: 3, txn: 'txn_1' } as const

    expect(parseFilters(updateSearchParams(params(''), filters))).toEqual(filters)
  })

  it('leaves defaults out of the URL', () => {
    expect(updateSearchParams(params('q=a&type=deposit&page=2&txn=txn_1'), DEFAULT_FILTERS).toString()).toBe(
      ''
    )
  })

  it('drops a search that is only spaces', () => {
    expect(updateSearchParams(params(''), { q: '   ' }).has('q')).toBe(false)
  })

  it.each([{ q: 'uber' }, { type: 'withdrawal' as const }, { status: 'pending' as const }])(
    'goes back to page 1 when %o changes',
    (update) => {
      expect(updateSearchParams(params('page=4'), update).has('page')).toBe(false)
    }
  )

  it('keeps the page when a filter is set to its current value or the details open', () => {
    expect(updateSearchParams(params('type=deposit&page=4'), { type: 'deposit' }).get('page')).toBe('4')
    expect(updateSearchParams(params('page=4'), { txn: 'txn_1' }).get('page')).toBe('4')
  })

  it('uses an explicit page even when a filter changes', () => {
    expect(updateSearchParams(params(''), { status: 'failed', page: 2 }).get('page')).toBe('2')
  })

  it('keeps unrelated params such as __scenario', () => {
    const next = updateSearchParams(params('__scenario=slow&type=deposit'), { type: '' })

    expect(next.toString()).toBe('__scenario=slow')
  })
})
