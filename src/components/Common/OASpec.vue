<script setup>
import { useOpenapi } from 'vitepress-theme-openapi'

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
      v-for="path in openapi.json.paths"
      :key="path.id"
      class="flex flex-col space-y-10"
    >
      <template v-for="method in Object.keys(path)">
        <OAOperation
          v-if="path[method].operationId"
          :key="`${method}-${path.id}`"
          :operation-id="path[method].operationId"
          :is-dark="props.isDark"
          prefix-headings
          hide-default-footer
        />
      </template>

      <hr>
    </div>

    <OAFooter />
  </div>
</template>
