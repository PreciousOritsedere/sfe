import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders a native button that does not submit forms by default', () => {
    render(<Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button')
  })

  it('can be activated from the keyboard', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)

    await userEvent.tab()
    await userEvent.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire clicks when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>
    )

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })
})
