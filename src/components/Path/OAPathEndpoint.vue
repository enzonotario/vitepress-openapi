<script setup>
import OAMethodBadge from 'vitepress-openapi/components/Common/OAMethodBadge.vue'

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
  hideBaseUrl: {
    type: Boolean,
    default: false,
  },
  deprecated: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="flex flex-row items-center space-x-4 text-sm bg-muted rounded p-2 overflow-x-auto">
    <OAMethodBadge :method="props.method" />
    <span class="flex flex-row flex-shrink-0 text-gray-600 dark:text-gray-400">
      <span
        v-if="!props.hideBaseUrl"
        class="hidden md:inline-block"
      >
        {{ props.baseUrl }}
      </span>
      <span
        :class="{
          'line-through': props.deprecated,
        }"
        class="text-gray-800 dark:text-gray-200 font-bold select-all"
      >{{ props.path }}</span>
    </span>
  </div>
</template>
