<script setup lang="ts">
import type { HTMLAttributes, Slot, VNode } from 'vue'
import { useVModel } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import { Comment, computed, Fragment, Text, useSlots } from 'vue'
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

const showClear = computed(() => props.clearable && hasValue.value)

function slotHasContent(slot: Slot | undefined): boolean {
  if (!slot) {
    return false
  }

  return vnodesHaveContent(slot())
}

function vnodesHaveContent(nodes: VNode[] | undefined): boolean {
  if (!nodes?.length) {
    return false
  }

  return nodes.some((node) => {
    if (node.type === Comment) {
      return false
    }

    if (node.type === Text || node.type === Fragment) {
      if (typeof node.children === 'string') {
        return node.children.trim().length > 0
      }

      return vnodesHaveContent(node.children as VNode[] | undefined)
    }

    return true
  })
}

// Evaluated during render (not a computed on slots.*) so parent `v-if` on
// `#trailing` correctly drops padding when the slot renders nothing.
function hasTrailingContent(): boolean {
  return slotHasContent(slots.trailing)
}

function useAffixWrapper(): boolean {
  return Boolean(props.clearable || hasTrailingContent())
}

function inputPaddingClass(): string | undefined {
  const trailing = hasTrailingContent()

  if (showClear.value && trailing) {
    return 'pr-28'
  }
  if (trailing) {
    return 'pr-24'
  }
  if (props.clearable) {
    return 'pr-8'
  }
  return undefined
}

function clear() {
  modelValue.value = ''
}
</script>

<template>
  <div v-if="useAffixWrapper()" class="relative flex items-center w-full">
    <input
      v-bind="$attrs"
      v-model="modelValue"
      :type="props.type ?? 'text'"
      :class="cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        inputPaddingClass(),
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
