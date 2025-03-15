<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from 'radix-vue'
import type { ComputedRef } from 'vue'
import { SelectRoot, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<SelectRootProps>()
const emits = defineEmits<SelectRootEmits>()

const forwarded: ComputedRef<SelectRootProps> = useForwardPropsEmits(props, emits)
</script>

<template>
  <SelectRoot v-bind="forwarded">
    <slot />
  </SelectRoot>
</template>
