import type { Transaction } from '@/types/api'
import { groupByDay } from './groupByDay'

/** A transaction at a local date and time, so the tests pass in any timezone. */
const at = (id: string, ...local: [number, number, number, number, number]) =>
  ({ id, createdAt: new Date(...local).toISOString() }) as Transaction

const now = new Date(2026, 9, 13, 15, 0)

const summary = (transactions: Transaction[]) =>
  groupByDay(transactions, now).map((group) => [group.label, group.transactions.map((t) => t.id)])

describe('groupByDay', () => {
  it('labels today, yesterday and older days, keeping the order', () => {
    const transactions = [
      at('a', 2026, 9, 13, 14, 22),
      at('b', 2026, 9, 13, 9, 3),
      at('c', 2026, 9, 12, 21, 16),
      at('d', 2026, 9, 5, 19, 30),
      at('e', 2026, 9, 5, 7, 58),
    ]

    expect(summary(transactions)).toEqual([
      ['Today', ['a', 'b']],
      ['Yesterday', ['c']],
      ['Mon, 5 Oct 2026', ['d', 'e']],
    ])
  })

  it('splits groups at local midnight', () => {
    expect(summary([at('after', 2026, 9, 13, 0, 1), at('before', 2026, 9, 12, 23, 59)])).toEqual([
      ['Today', ['after']],
      ['Yesterday', ['before']],
    ])
  })

  it('handles yesterday across a month boundary', () => {
    const firstOfMonth = new Date(2026, 10, 1, 8, 0)

    expect(groupByDay([at('a', 2026, 9, 31, 22, 0)], firstOfMonth)[0].label).toBe('Yesterday')
  })

  it('returns no groups for no transactions', () => {
    expect(groupByDay([], now)).toEqual([])
  })
})
