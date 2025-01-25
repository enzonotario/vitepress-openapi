<script setup lang="ts">
import type { ToastDescriptionProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ToastDescription } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '../../../../../../src/lib/utils'

const props = defineProps<ToastDescriptionProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ToastDescription :class="cn('text-sm opacity-90', props.class)" v-bind="delegatedProps">
    <slot />
  </ToastDescription>
</template>
