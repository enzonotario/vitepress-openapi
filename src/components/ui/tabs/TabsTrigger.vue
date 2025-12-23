<script setup lang="ts">
import type { TabsTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { TabsTriggerVariants } from './index'
import { cn } from '@/lib/utils/utils'
import { TabsTrigger, useForwardProps } from 'reka-ui'
import { computed } from 'vue'
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
