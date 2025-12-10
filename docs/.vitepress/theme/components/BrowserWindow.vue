<script setup lang="ts">
import { cn } from '../../../../src/lib/utils/utils'

const props = defineProps({
  showBrowserDots: {
    type: Boolean,
    default: true,
  },
  className: {
    type: String,
    default: '',
  },
  shadow: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div
    class="rounded border overflow-hidden"
    :class="cn({
      'shadow-lg': props.shadow,
    }, props.className)"
  >
    <div
      v-if="props.showBrowserDots"
      class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <span class="w-3 h-3 bg-red-500 rounded-full" />
      <span class="w-3 h-3 bg-yellow-500 rounded-full" />
      <span class="w-3 h-3 bg-green-500 rounded-full" />

      <span class="flex-1" />

      <slot name="title-end" />
    </div>

    <div class="relative w-full h-full overflow-x-hidden">
      <slot />
    </div>
  </div>
</template>
