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
  <div class="flex flex-row items-center space-x-4 text-sm bg-gray-100 dark:bg-gray-800 rounded p-2 overflow-x-auto">
    <Badge
      :class="{
        'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200': props.method === 'GET',
        'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200': props.method === 'POST',
        'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200': props.method === 'PUT',
        'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200': props.method === 'DELETE',
      }"
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
