'use client'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { User } from '@/types/api'
import { Avatar, Icon } from '@/components/ui'
import { getMe } from '@/lib/api/endpoints'
import styles from './UserMenu.module.css'

const TIER_LABELS: Record<User['tier'], string> = {
  basic: 'Basic',
  verified: 'Verified',
  premium: 'Premium',
}

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const { data: user, isError } = useQuery({
    queryKey: ['me'],
    queryFn: ({ signal }) => getMe({ signal }).then((res) => res.data),
  })

  return (
    <div className={styles.menu}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={user ? `Account menu, ${user.firstName}` : 'Account menu'}
      >
        <Avatar src={user?.avatarUrl ?? null} alt="" size="sm" />
        <span className={styles.name}>{user?.firstName}</span>
        <span className={styles.chevron}>
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      {/* Kept mounted (and inert while closed) so it can animate out. */}
      <div className={styles.dropdown} data-state={open ? 'open' : 'closed'} inert={!open}>
        {user ? (
          <>
            <div className={styles.fullName}>
              {user.firstName} {user.lastName}
            </div>
            <div className={styles.email}>{user.email}</div>
            <div className={styles.tier}>{TIER_LABELS[user.tier]} account</div>
          </>
        ) : (
          <div className={styles.status}>{isError ? 'Couldn’t load your profile.' : 'Loading…'}</div>
        )}
      </div>
    </div>
  )
}
