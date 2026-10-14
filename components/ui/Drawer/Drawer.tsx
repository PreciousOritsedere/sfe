'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { useRef, type ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './Drawer.module.css'

export interface DrawerProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

/** Side panel on desktop, bottom sheet on mobile. Traps focus, closes on Escape and overlay click. */
export function Drawer({ open, title, onClose, children, footer }: DrawerProps) {
  // Radix only restores focus to a Dialog.Trigger; drawers here are opened from code (e.g. a row click).
  const returnFocusRef = useRef<HTMLElement | null>(null)

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.panel}
          aria-describedby={undefined}
          onOpenAutoFocus={() => {
            returnFocusRef.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null
          }}
          onCloseAutoFocus={(event) => {
            const target = returnFocusRef.current
            if (target?.isConnected) {
              event.preventDefault()
              target.focus()
            }
          }}
        >
          <span className={styles.handle} aria-hidden />
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            <Dialog.Close className={styles.close} aria-label="Close">
              <Icon name="close" size={20} />
            </Dialog.Close>
          </div>
          <div className={styles.body}>{children}</div>
          {footer && <div className={styles.footer}>{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
