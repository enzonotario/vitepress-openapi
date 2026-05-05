<script setup lang="ts">
import type { TabsRootEmits, TabsRootProps } from 'reka-ui'
import type { ComputedRef } from 'vue'
import { TabsRoot, useForwardPropsEmits } from 'reka-ui'

const props = defineProps<TabsRootProps<string | number>>()
const emits = defineEmits<TabsRootEmits<string | number>>()

const forwarded: ComputedRef<TabsRootProps<string | number>> = useForwardPropsEmits(props, emits)
</script>

<template>
  <TabsRoot v-bind="forwarded">
    <slot />
  </TabsRoot>
</template>
