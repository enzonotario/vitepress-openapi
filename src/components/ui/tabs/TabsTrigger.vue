<script setup lang="ts">
import type { TabsTriggerProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import type { TabsTriggerVariants } from './index'
import { TabsTrigger, useForwardProps } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '../../../lib/utils'
import { tabsTriggerVariants } from './index'

interface Props extends TabsTriggerProps {
  variant?: TabsTriggerVariants['variant']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {})

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TabsTrigger
    v-bind="forwardedProps"
    :class="cn(tabsTriggerVariants({ variant }), props.class)"
  >
    <slot />
  </TabsTrigger>
</template>
