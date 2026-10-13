'use client'
import * as RadixSelect from '@radix-ui/react-select'
import { useId } from 'react'
import { cx } from '@/lib/cx'
import { Field } from '../Field'
import { Icon } from '../Icon'
import styles from './Select.module.css'

// Radix reserves "" for "no selection", so options like "All types" use a stand-in value internally.
const EMPTY = '__empty__'
const toItemValue = (value: string) => (value === '' ? EMPTY : value)

export interface SelectOption<T extends string = string> {
  value: T
  label: string
}

export interface SelectProps<T extends string = string> {
  label: string
  hideLabel?: boolean
  options: readonly SelectOption<T>[]
  value: T
  onValueChange: (value: T) => void
  disabled?: boolean
  id?: string
  name?: string
  fieldClassName?: string
  className?: string
}

export function Select<T extends string = string>({
  label,
  hideLabel,
  options,
  value,
  onValueChange,
  disabled,
  id: idProp,
  name,
  fieldClassName,
  className,
}: SelectProps<T>) {
  const autoId = useId()
  const id = idProp ?? autoId

  const handleValueChange = (itemValue: string) => {
    const option = options.find((o) => toItemValue(o.value) === itemValue)
    if (option) onValueChange(option.value)
  }

  return (
    <Field label={label} htmlFor={id} hideLabel={hideLabel} className={fieldClassName}>
      <RadixSelect.Root
        value={toItemValue(value)}
        onValueChange={handleValueChange}
        disabled={disabled}
        name={name}
      >
        <RadixSelect.Trigger id={id} className={cx(styles.trigger, className)}>
          <RadixSelect.Value className={styles.value} />
          <RadixSelect.Icon className={styles.chevron}>
            <Icon name="chevron-down" size={16} />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content position="popper" sideOffset={4} className={styles.content}>
            <RadixSelect.Viewport className={styles.viewport}>
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={toItemValue(option.value)}
                  className={styles.item}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </Field>
  )
}
