<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { TabsTrigger, type TabsTriggerProps, useForwardProps } from 'radix-vue'
import { cn } from 'vitepress-theme-openapi/lib/utils'
import { type TabsTriggerVariants, tabsTriggerVariants } from './index'

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
