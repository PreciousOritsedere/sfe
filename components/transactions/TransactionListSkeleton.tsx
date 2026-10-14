import styles from './TransactionListSkeleton.module.css'

const ROWS = 6

export function TransactionListSkeleton() {
  return (
    <div className={styles.list} role="status">
      <span className="visually-hidden">Loading transactions…</span>
      <div className={styles.day} aria-hidden>
        <span className={styles.bone} style={{ width: 48 }} />
      </div>
      {Array.from({ length: ROWS }, (_, index) => (
        <div key={index} className={styles.row} aria-hidden>
          <span className={styles.avatar} />
          <span className={styles.lines}>
            <span className={styles.bone} style={{ width: '22%' }} />
            <span className={styles.bone} style={{ width: '48%' }} />
          </span>
          <span className={styles.end}>
            <span className={styles.bone} style={{ width: 96 }} />
            <span className={styles.bone} style={{ width: 40 }} />
          </span>
        </div>
      ))}
    </div>
  )
}
