import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Money } from './Money'

const text = (ui: ReactElement) => render(ui).container.textContent

describe('Money', () => {
  it('always shows two decimals', () => {
    expect(text(<Money amount={124583050} currency="NGN" />)).toBe('₦1,245,830.50')
    expect(text(<Money amount={1000} currency="USD" />)).toBe('$10.00')
  })

  it('uses the symbol for each currency', () => {
    expect(text(<Money amount={120000} currency="GHS" />)).toBe('GH₵1,200.00')
  })

  it('prefixes credits with a plus and debits with a minus sign', () => {
    expect(text(<Money amount={2500000} currency="NGN" sign="credit" />)).toBe('+₦25,000.00')
    expect(text(<Money amount={1549} currency="USD" sign="debit" />)).toBe('−$15.49')
  })
})
