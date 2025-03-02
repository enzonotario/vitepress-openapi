<script setup lang="ts">
import type { Ref, WritableComputedRef } from 'vue'
import type { SelectOption } from './index'
import { useVModel } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { Input } from '../input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../select'

const props = defineProps({
  modelValue: {
    type: [String],
    default: '',
  },
  defaultCustomValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array<SelectOption | string>,
    required: true,
  },
  placeholder: {
    type: String,
    default: 'Select an option...',
  },
  customOptionLabel: {
    type: String,
    default: 'Custom...',
  },
  customPlaceholder: {
    type: String,
    default: 'Enter custom value...',
  },
})

const emit = defineEmits([
  'update:modelValue',
  'update:customValue',
])

const value: WritableComputedRef<string> = useVModel(props, 'modelValue', emit)
const valueIsInOptions = computed(() => props.options.some(option => typeof option === 'object' ? option.value === value.value : option === value.value))
const isCustom = ref(!valueIsInOptions.value)
const customValue: Ref<string | undefined> = ref(isCustom.value ? value.value : props.defaultCustomValue)

watch(customValue, (newValue) => {
  if (newValue === undefined) {
    return
  }

  if (isCustom.value) {
    value.value = newValue
  }
})

const displayOptions = computed(() => {
  return [
    ...props.options,
    { label: props.customOptionLabel, value: 'custom' },
  ]
})

const handleSelectChange = (selectedValue: string) => {
  if (selectedValue === 'custom') {
    isCustom.value = true
    const inputEl: HTMLInputElement | null = document.querySelector('.oa-custom-input input')
    if (inputEl) {
      inputEl.focus()
    }
    value.value = props.defaultCustomValue
  } else {
    isCustom.value = false
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
      />
    </div>

    <Select
      :model-value="value"
      class="absolute inset-0"
      @update:model-value="handleSelectChange"
    >
      <SelectTrigger>
        <SelectValue :placeholder="placeholder" />
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
