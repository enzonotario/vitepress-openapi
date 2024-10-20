<script setup>
import { defineProps } from 'vue'

const { openapi, paths, isDark } = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
  paths: {
    type: Object,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    v-for="(path, pathName) in paths"
    :key="pathName"
    class="flex flex-col space-y-10"
  >
    <template
      v-for="method in Object.keys(path).filter(m => path[m].operationId)"
      :key="`${method}-${path.id}`"
    >
      <OAOperation
        :operation-id="path[method].operationId"
        :openapi="openapi"
        :is-dark="isDark"
        prefix-headings
        hide-default-footer
      />

      <hr>
    </template>
  </div>
</template>
