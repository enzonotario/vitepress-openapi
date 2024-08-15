<script setup>
import { useOpenapi } from 'vitepress-theme-openapi/composables/useOpenapi'

const props = defineProps({
  isDark: {
    type: Boolean,
    default: false,
  },
})

const openapi = useOpenapi()
</script>

<template>
  <div class="flex flex-col space-y-10">
    <div
      v-for="path in openapi.spec.paths"
      :key="path.id"
      class="flex flex-col space-y-10"
    >
      <OAOperation
        v-for="method in Object.keys(path)"
        :key="`${method}-${path.id}`"
        :operation-id="path[method].operationId"
        :method="method.toUpperCase()"
        :is-dark="isDark"
        prefix-headings
        hide-default-footer
      />
      <OAFooter />
    </div>
  </div>
</template>
