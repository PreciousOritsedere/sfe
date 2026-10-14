import { describeTransaction } from './transaction'

describe('describeTransaction', () => {
  it('names the other side of a transfer', () => {
    expect(describeTransaction({ type: 'transfer_out', counterparty: 'Kwame Mensah' })).toBe(
      'Transfer out to Kwame Mensah'
    )
    expect(describeTransaction({ type: 'transfer_in', counterparty: 'Ada Okafor' })).toBe(
      'Transfer in from Ada Okafor'
    )
  })

  it('falls back to the type', () => {
    expect(describeTransaction({ type: 'card_payment', counterparty: null })).toBe('Card payment')
    expect(describeTransaction({ type: 'transfer_out', counterparty: null })).toBe('Transfer out')
  })
})
