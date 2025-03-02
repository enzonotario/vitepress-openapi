export interface SelectWithCustomOptionProps {
  modelValue: string
  options: Array<SelectWithCustomOptionItem | string>
  placeholder?: string
  defaultCustomValue?: string
  customOptionLabel?: string
  customPlaceholder?: string
  allowCustomOption?: boolean
}

export interface SelectWithCustomOptionEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:customValue', value: string): void
}

export interface SelectWithCustomOptionItem {
  value: string
  label: string
}
