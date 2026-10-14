import { Button } from '@/components/ui'
import { cx } from '@/lib/cx'
import { getPageItems } from '@/lib/transactions/getPageItems'
import styles from './Pagination.module.css'

export interface PaginationProps {
  page: number
  totalPages: number
  /** Total number of items, for "Showing 1–20 of 237". */
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

const format = (n: number) => n.toLocaleString('en-GB')

export function Pagination({ page, totalPages, total, pageSize, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const first = (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <p className={styles.summary}>
        Showing {format(first)}–{format(last)} of {format(total)}
      </p>

      <div className={styles.controls}>
        <Button
          variant="secondary"
          size="sm"
          iconLeft="chevron-left"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <span className={styles.wide}>Previous</span>
          <span className={styles.narrow}>Prev</span>
        </Button>

        <ul className={styles.pages}>
          {getPageItems(page, totalPages).map((item, index) => (
            <li key={item === 'ellipsis' ? `ellipsis-${index}` : item}>
              {item === 'ellipsis' ? (
                <span className={styles.ellipsis} aria-hidden>
                  …
                </span>
              ) : (
                <button
                  type="button"
                  className={cx(styles.page, item === page && styles.current)}
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? 'page' : undefined}
                  onClick={() => item !== page && onPageChange(item)}
                >
                  {item}
                </button>
              )}
            </li>
          ))}
        </ul>

        <p className={styles.position}>
          Page {format(page)} of {format(totalPages)}
        </p>

        <Button
          variant="secondary"
          size="sm"
          iconRight="chevron-right"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  )
}
