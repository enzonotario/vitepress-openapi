export interface SelectWithCustomOptionProps {
  modelValue: string
  isCustom: boolean
  customValue?: string
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
  (e: 'update:isCustom', value: boolean): void
  (e: 'submit'): void
}

export interface SelectWithCustomOptionItem {
  value: string
  label: string
}
