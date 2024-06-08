<script setup>
import {useOpenapi} from "vitepress-theme-openapi/composables/useOpenapi";

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
    <OAOperation v-for="path in openapi.spec.paths"
                 :key="path.id"
                 :operation-id="path.get.operationId"
                 :isDark="isDark"
                 prefix-headings
                 hide-default-footer
    />

    <OAFooter />
  </div>
</template>
