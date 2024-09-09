<script setup>
import { OpenApi, useOpenapi } from 'vitepress-theme-openapi'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const openapi = OpenApi({ spec: props.spec || useOpenapi().json })

const paths = openapi.getPaths()
</script>

<template>
  <div class="flex flex-col space-y-10">
    <div
      v-for="path in paths"
      :key="path.id"
      class="flex flex-col space-y-10"
    >
      <template v-for="method in Object.keys(path)">
        <OAOperation
          v-if="path[method].operationId"
          :key="`${method}-${path.id}`"
          :operation-id="path[method].operationId"
          :spec="props.spec"
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
