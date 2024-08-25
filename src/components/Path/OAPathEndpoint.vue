<script setup>
import { Badge } from 'vitepress-theme-openapi/components/ui/badge'

const props = defineProps({
  method: {
    type: String,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  hideBaseUrl: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="flex flex-row items-center space-x-4 text-sm bg-muted rounded p-2 overflow-x-auto">
    <Badge
      variant="plain"
      :class="[`OAMethodBadge--${props.method.toLowerCase()}`]"
      class="px-2 py-1 rounded"
    >
      {{ props.method }}
    </Badge>
    <span class="text-gray-600 dark:text-gray-400 inline-flex items-center">
      <span
        v-if="!props.hideBaseUrl"
        class="hidden md:inline-block"
      >{{ props.baseUrl }}</span>
      <span class="text-gray-800 dark:text-gray-200 font-bold select-all">{{ props.path }}</span>
    </span>
  </div>
</template>
