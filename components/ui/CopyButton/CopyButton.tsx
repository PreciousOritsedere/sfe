'use client'
import { useEffect, useState } from 'react'
import { cx } from '@/lib/cx'
import { Icon } from '../Icon'
import styles from './CopyButton.module.css'

const FEEDBACK_MS = 2000

export interface CopyButtonProps {
  value: string
  /** Accessible name, e.g. "Copy reference". */
  label: string
  className?: string
}

export function CopyButton({ value, label, className }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = setTimeout(() => setStatus('idle'), FEEDBACK_MS)
    return () => clearTimeout(timer)
  }, [status])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  return (
    <span className={cx(styles.wrapper, className)}>
      <button type="button" className={styles.button} aria-label={label} onClick={copy}>
        <Icon name="copy" size={14} />
      </button>
      <span className={styles.feedback} role="status">
        {status === 'copied' ? 'Copied' : status === 'failed' ? 'Couldn’t copy' : ''}
      </span>
    </span>
  )
}
