import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from './Select'

const OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdrawal', label: 'Withdrawal' },
  { value: 'card_payment', label: 'Card payment' },
] as const

function renderSelect(value: (typeof OPTIONS)[number]['value'] = '') {
  const onValueChange = vi.fn()
  render(<Select label="Type" options={OPTIONS} value={value} onValueChange={onValueChange} />)
  return { onValueChange, trigger: screen.getByRole('combobox', { name: 'Type' }) }
}

describe('Select', () => {
  it('is labelled by its field label and shows the selected option', () => {
    const { trigger } = renderSelect('deposit')

    expect(trigger).toHaveTextContent('Deposit')
  })

  it('supports an empty value for "All" options', () => {
    const { trigger } = renderSelect('')

    expect(trigger).toHaveTextContent('All types')
  })

  it('can be opened and used with the keyboard', async () => {
    const { onValueChange, trigger } = renderSelect('')

    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'All types' })).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}')

    expect(onValueChange).toHaveBeenCalledWith('withdrawal')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('emits an empty string when an "All" option is chosen', async () => {
    const { onValueChange, trigger } = renderSelect('deposit')

    await userEvent.click(trigger)
    await userEvent.click(screen.getByRole('option', { name: 'All types' }))

    expect(onValueChange).toHaveBeenCalledWith('')
  })

  it('closes on Escape without changing the value', async () => {
    const { onValueChange, trigger } = renderSelect('deposit')

    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
