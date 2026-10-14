import { CopyButton, Money } from '@/components/ui'
import { cx } from '@/lib/cx'
import { describeTransaction, formatDateTime, isCredit, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import type { Transaction } from '@/types/api'
import { StatusBadge } from './StatusBadge'
import { TransactionAvatar } from './TransactionAvatar'
import styles from './TransactionDetails.module.css'

/** Body of the transaction details drawer. */
export function TransactionDetails({ transaction: tx }: { transaction: Transaction }) {
  const credit = isCredit(tx.type)

  return (
    <div className={styles.details}>
      <div className={styles.hero}>
        <TransactionAvatar transaction={tx} size="lg" />
        <p className={styles.description}>{describeTransaction(tx)}</p>
        <Money
          amount={tx.amount}
          currency={tx.currency}
          sign={credit ? 'credit' : 'debit'}
          className={cx(styles.amount, credit && styles.credit)}
        />
        <StatusBadge status={tx.status} />
      </div>

      <section className={styles.section} aria-labelledby="transaction-details-heading">
        <h3 id="transaction-details-heading" className={styles.sectionTitle}>
          Details
        </h3>
        <dl className={styles.rows}>
          <div className={styles.row}>
            <dt>Reference</dt>
            <dd className={styles.reference}>
              <span className={styles.mono}>{tx.reference}</span>
              <CopyButton value={tx.reference} label="Copy reference" />
            </dd>
          </div>
          <div className={styles.row}>
            <dt>Date</dt>
            <dd>
              <time dateTime={tx.createdAt}>{formatDateTime(tx.createdAt)}</time>
            </dd>
          </div>
          <div className={styles.row}>
            <dt>Type</dt>
            <dd>{TRANSACTION_TYPE_LABELS[tx.type]}</dd>
          </div>
          {tx.counterparty && (
            <div className={styles.row}>
              <dt>Counterparty</dt>
              <dd>{tx.counterparty}</dd>
            </div>
          )}
          <div className={styles.row}>
            <dt>Narration</dt>
            <dd>{tx.narration}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby="transaction-summary-heading">
        <h3 id="transaction-summary-heading" className={styles.sectionTitle}>
          Summary
        </h3>
        <dl className={styles.rows}>
          <div className={styles.row}>
            <dt>Amount</dt>
            <dd>
              <Money amount={tx.amount} currency={tx.currency} />
            </dd>
          </div>
          <div className={styles.row}>
            <dt>Fee</dt>
            <dd>
              <Money amount={tx.fee} currency={tx.currency} />
            </dd>
          </div>
          <div className={cx(styles.row, styles.total)}>
            <dt>Total</dt>
            <dd>
              <Money amount={tx.amount + tx.fee} currency={tx.currency} />
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

/** Placeholder matching the Figma "Details — loading" frame. */
export function TransactionDetailsSkeleton() {
  return (
    <div className={styles.details} role="status">
      <span className="visually-hidden">Loading transaction…</span>
      <div className={styles.hero} aria-hidden>
        <span className={cx(styles.bone, styles.circle)} />
        <span className={styles.bone} style={{ width: 140, height: 10 }} />
        <span className={styles.bone} style={{ width: 180, height: 24 }} />
        <span className={styles.bone} style={{ width: 72, height: 18 }} />
      </div>
      <div className={styles.rows} aria-hidden>
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className={styles.row}>
            <span className={styles.bone} style={{ width: 80, height: 10 }} />
            <span className={styles.bone} style={{ width: 120, height: 10 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
