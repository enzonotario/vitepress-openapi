<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'

interface Props {
  href?: string
  method?: OpenAPIV3.HttpMethods | string
  title?: string
}

withDefaults(defineProps<Props>(), {
  href: '',
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
    <span>{{ title }}</span>
  </component>
</template>

<style>
.OAOperationLink {
  @apply inline-block px-1 space-x-1 rounded cursor-pointer;
  text-decoration: none !important;
  color: var(--vp-c-text-1) !important;
  font-weight: normal !important;
}

.OAOperationLink:hover {
  color: var(--vp-c-brand) !important;
}

.OAOperationLink-badge {
  @apply px-1 py-0.5 text-xs rounded;
}
</style>
