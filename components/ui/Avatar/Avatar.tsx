import { cx } from '@/lib/cx'
import styles from './Avatar.module.css'

export interface AvatarProps {
  src: string | null
  alt: string
  /** Shown as initials when there is no image. */
  name?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/** "Kwame Mensah" -> "KM", "Okonkwo-Adeyemi Logistics Ltd" -> "OA". */
export function getInitials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter((word) => /^\p{L}/u.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const classes = cx(styles.avatar, styles[size], className)

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- avatars come from arbitrary CDNs
    return <img src={src} alt={alt} className={classes} />
  }

  const initials = name ? getInitials(name) : ''
  return (
    <span
      className={cx(classes, styles.initials)}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    >
      {initials}
    </span>
  )
}
