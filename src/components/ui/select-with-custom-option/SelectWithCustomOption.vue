<script setup lang="ts">
import type { WritableComputedRef } from 'vue'
import type { SelectWithCustomOptionEmits, SelectWithCustomOptionProps } from './index'
import { useI18n } from '@byjohann/vue-i18n'
import { useVModel } from '@vueuse/core'
import { computed, watch } from 'vue'
import { Input } from '../input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../select'

const props = withDefaults(defineProps<SelectWithCustomOptionProps>(), {
  modelValue: '',
  defaultCustomValue: '',
  placeholder: 'Select an option...',
  customOptionLabel: 'Custom...',
  customPlaceholder: 'Enter custom value...',
  allowCustomOption: true,
  isCustom: false,
  customValue: undefined,
})

const emit = defineEmits<SelectWithCustomOptionEmits>()

const CUSTOM_VALUE = 'custom'

const value: WritableComputedRef<string> = useVModel(props, 'modelValue', emit)
const isCustom: WritableComputedRef<boolean> = useVModel(props, 'isCustom', emit)
const customValue: WritableComputedRef<string | undefined> = useVModel(props, 'customValue', emit)

const { t } = useI18n()

watch(customValue, (newValue) => {
  if (newValue === undefined) {
    return
  }

  if (isCustom.value) {
    value.value = newValue
  }

  emit('update:customValue', newValue)
})

const displayOptions = computed(() => {
  return props.allowCustomOption
    ? [...props.options, { label: props.customOptionLabel, value: CUSTOM_VALUE }]
    : props.options
})

const handleSelectChange = (selectedValue: string) => {
  if (selectedValue === CUSTOM_VALUE) {
    isCustom.value = true
    const inputEl: HTMLInputElement | null = document.querySelector('.oa-custom-input input')
    if (inputEl) {
      inputEl.focus()
    }
    value.value = props.defaultCustomValue
  } else {
    isCustom.value = false
    customValue.value = undefined
    value.value = selectedValue
  }
}
</script>

<template>
  <div class="relative w-full h-10">
    <div v-if="isCustom" class="oa-custom-input absolute inset-0">
      <Input
        v-model="customValue"
        :placeholder="customPlaceholder"
        class="pr-8 bg-muted"
        @keydown.enter="emit('submit')"
      />
    </div>

    <Select
      :model-value="value"
      class="absolute inset-0"
      @update:model-value="handleSelectChange(String($event))"
    >
      <SelectTrigger :aria-label="t('Select')">
        <SelectValue :placeholder="placeholder" class="text-start" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="option in displayOptions"
            :key="typeof option === 'object' ? option.value : option"
            :value="typeof option === 'object' ? option.value : option"
          >
            {{ typeof option === 'object' ? option.label : option }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>
