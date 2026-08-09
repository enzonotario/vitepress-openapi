<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'
import type { ComputedRef } from 'vue'
import { DialogRoot, useForwardPropsEmits } from 'reka-ui'

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded: ComputedRef<DialogRootProps> = useForwardPropsEmits(props, emits)
</script>

<template>
  <DialogRoot v-bind="forwarded">
    <slot />
  </DialogRoot>
</template>
