import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Icon, type IconName } from '../Icon'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  icon: IconName
  tone?: 'primary' | 'danger'
  title: string
  description?: ReactNode
  action?: ReactNode
  /** `alert` announces the message to screen readers as soon as it appears (used for errors). */
  role?: 'alert' | 'status'
  className?: string
}

/** Icon, message and optional action, for empty, no-results and error states. */
export function EmptyState({
  icon,
  tone = 'primary',
  title,
  description,
  action,
  role,
  className,
}: EmptyStateProps) {
  return (
    <div className={cx(styles.empty, className)} role={role}>
      <span className={cx(styles.icon, styles[tone])} aria-hidden>
        <Icon name={icon} size={20} />
      </span>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
