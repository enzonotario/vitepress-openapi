<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import { computed, useSlots } from 'vue'
import { cn } from '@/lib/utils/utils'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
  type?: string
  clearable?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const slots = useSlots()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const hasValue = computed(() =>
  modelValue.value !== '' && modelValue.value !== null && modelValue.value !== undefined,
)

const hasTrailing = computed(() => Boolean(slots.trailing))

const showClear = computed(() => props.clearable && hasValue.value)

const useAffixWrapper = computed(() => props.clearable || hasTrailing.value)

const inputPaddingClass = computed(() => {
  if (showClear.value && hasTrailing.value) {
    return 'pr-28'
  }
  if (hasTrailing.value) {
    return 'pr-24'
  }
  if (props.clearable) {
    return 'pr-8'
  }
  return undefined
})

function clear() {
  modelValue.value = ''
}
</script>

<template>
  <div v-if="useAffixWrapper" class="relative flex items-center w-full">
    <input
      v-bind="$attrs"
      v-model="modelValue"
      :type="props.type ?? 'text'"
      :class="cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        inputPaddingClass,
        props.class,
      )"
    >
    <div class="absolute right-2 inset-y-0 flex items-center gap-1">
      <button
        v-if="showClear"
        type="button"
        class="text-muted-foreground hover:text-foreground focus:outline-none"
        tabindex="-1"
        @click="clear"
      >
        <X class="h-4 w-4" />
      </button>
      <slot name="trailing" />
    </div>
  </div>
  <input
    v-else
    v-bind="$attrs"
    v-model="modelValue"
    :type="props.type ?? 'text'"
    :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', props.class)"
  >
</template>
