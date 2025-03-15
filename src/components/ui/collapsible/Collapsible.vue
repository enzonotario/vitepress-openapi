<script setup lang="ts">
import type { CollapsibleRootEmits, CollapsibleRootProps } from 'radix-vue'
import type { ComputedRef } from 'vue'
import { CollapsibleRoot, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<CollapsibleRootProps>()
const emits = defineEmits<CollapsibleRootEmits>()

const forwarded: ComputedRef<CollapsibleRootProps> = useForwardPropsEmits(props, emits)
</script>

<template>
  <CollapsibleRoot
    v-slot="{ open }"
    v-bind="forwarded"
  >
    <slot :open="open" />
  </CollapsibleRoot>
</template>
