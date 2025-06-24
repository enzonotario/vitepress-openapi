<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { Slots } from 'vue'
import { computed, useSlots } from 'vue'
import OAMarkdown from '../Common/OAMarkdown.vue'

interface Props {
  href?: string
  method?: OpenAPIV3.HttpMethods | string
  title?: string
  operationId?: string
}

const props = withDefaults(defineProps<Props>(), {
  href: undefined,
  method: '',
  title: '',
  operationId: undefined,
})

const slots: Slots = useSlots()

function hasSlot(name: string): boolean {
  return !!slots[name]
}

const slotContent = computed<string>(() => {
  if (!hasSlot('default')) {
    return ''
  }

  const slot = slots.default?.()

  if (!slot || !Array.isArray(slot) || slot.length === 0) {
    return ''
  }

  return typeof slot[0].children === 'string' ? slot[0].children : ''
})
</script>

<template>
  <component
    :is="props.href ? 'a' : 'span'"
    :href="props.href"
    class="OAOperationLink group/oaOperationLink"
  >
    <span class="OAOperationLink-badge" :class="[`OAMethodBadge--${method.toLowerCase()}`]">
      {{ method.toUpperCase() }}
    </span>
    <OAMarkdown v-if="hasSlot('default')" :content="slotContent" class="inline-block" />
    <span v-else class="OAOperationLink-title">{{ props.title }}</span>
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
