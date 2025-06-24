<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'

interface Props {
  href?: string
  method?: OpenAPIV3.HttpMethods | string
  title?: string
}

withDefaults(defineProps<Props>(), {
  href: undefined,
  method: '',
  title: '',
})
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    :href="href"
    class="OAOperationLink group/oaOperationLink"
  >
    <span class="OAOperationLink-badge" :class="[`OAMethodBadge--${method.toLowerCase()}`]">
      {{ method.toUpperCase() }}
    </span>
    <span class="OAOperationLink-title">{{ title }}</span>
  </component>
</template>

<style>
.OAOperationLink {
  @apply inline-block px-1 space-x-1 rounded cursor-pointer;
}

.OAOperationLink-badge {
  @apply px-1 py-0.5 text-xs rounded;
  font-weight: normal !important;
  text-decoration: none !important;
  display: inline-block;
}
</style>
