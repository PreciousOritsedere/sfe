import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import styles from './Field.module.css'

export interface FieldProps {
  label: string
  /** The `id` of the control this field labels. */
  htmlFor: string
  hint?: ReactNode
  error?: string
  /** Visually hide the label (it is still rendered). */
  hideLabel?: boolean
  className?: string
  children: ReactNode
}

/** The id to pass as the control's `aria-describedby`, matching what Field renders. */
export function fieldDescriptionId(htmlFor: string, { hint, error }: Pick<FieldProps, 'hint' | 'error'>) {
  if (error) return `${htmlFor}-error`
  if (hint) return `${htmlFor}-hint`
  return undefined
}

/** Label + control + hint/error. Used by Input and Select. */
export function Field({ label, htmlFor, hint, error, hideLabel, className, children }: FieldProps) {
  const descriptionId = fieldDescriptionId(htmlFor, { hint, error })
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={htmlFor} className={cx(styles.label, hideLabel && 'visually-hidden')}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={descriptionId} className={styles.error}>
          {error}
        </p>
      ) : hint ? (
        <p id={descriptionId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}
