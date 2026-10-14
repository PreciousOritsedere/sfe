import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Drawer } from './Drawer'

function DrawerWithOpener() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open details
      </button>
      <Drawer open={open} title="Transaction details" onClose={() => setOpen(false)}>
        <p>Details</p>
      </Drawer>
    </>
  )
}

function renderDrawer(open = true) {
  const onClose = vi.fn()
  render(
    <Drawer open={open} title="Transaction details" onClose={onClose}>
      <p>Reference ACM-48213377</p>
    </Drawer>
  )
  return { onClose }
}

describe('Drawer', () => {
  it('renders nothing when closed', () => {
    renderDrawer(false)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is a dialog named by its title, with focus inside', () => {
    renderDrawer()

    const dialog = screen.getByRole('dialog', { name: 'Transaction details' })
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
  })

  it('closes on Escape and from the close button', async () => {
    const { onClose } = renderDrawer()

    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('returns focus to whatever opened it', async () => {
    render(<DrawerWithOpener />)
    const opener = screen.getByRole('button', { name: 'Open details' })

    await userEvent.click(opener)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('stays open when its content is clicked', async () => {
    const { onClose } = renderDrawer()

    await userEvent.click(screen.getByText('Reference ACM-48213377'))

    expect(onClose).not.toHaveBeenCalled()
  })
})
