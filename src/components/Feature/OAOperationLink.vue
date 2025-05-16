<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'
import { computed } from 'vue'

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
  <a :href="href" class="OAOperationLink group/oaSidebarItem">
    <span class="OAOperationLink-badge" :class="[`OAMethodBadge--${method.toLowerCase()}`]">
      {{ method.toUpperCase() }}
    </span>
    <span>{{ title }}</span>
  </a>
</template>

<style>
.OAOperationLink {
  @apply px-1 space-x-1 rounded cursor-pointer !no-underline !text-foreground !font-normal;
}

.OAOperationLink:hover {
  color: var(--vp-c-brand) !important;
}

.OAOperationLink-badge {
  @apply px-1 py-0.5 text-xs rounded;
}
</style>
