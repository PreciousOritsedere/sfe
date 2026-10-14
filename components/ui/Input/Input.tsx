import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Field, fieldDescriptionId } from '../Field'
import { Icon, type IconName } from '../Icon'
import styles from './Input.module.css'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  hideLabel?: boolean
  hint?: ReactNode
  error?: string
  leadingIcon?: IconName
  fieldClassName?: string
}

export function Input({
  id: idProp,
  label,
  hideLabel,
  hint,
  error,
  leadingIcon,
  fieldClassName,
  className,
  ...rest
}: InputProps) {
  const autoId = useId()
  const id = idProp ?? autoId

  return (
    <Field
      label={label}
      htmlFor={id}
      hideLabel={hideLabel}
      hint={hint}
      error={error}
      className={fieldClassName}
    >
      <div className={styles.control}>
        {leadingIcon && <Icon name={leadingIcon} size={16} className={styles.icon} />}
        <input
          id={id}
          className={cx(styles.input, leadingIcon && styles.withIcon, error && styles.invalid, className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={fieldDescriptionId(id, { hint, error })}
          {...rest}
        />
      </div>
    </Field>
  )
}
