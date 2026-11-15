<script setup lang="ts">
import type { OperationNestedSlot, OperationSlot } from '../../types'
import { defineAsyncComponent, hydrateOnVisible } from 'vue'
import { getGlobalOpenapi, injectOpenapi } from '../../composables/useOpenapi'
import { useLazyRendering } from '../../lib/spec/lazyRendering'
import OALazy from '../Common/Lazy/OALazy.vue'
import OAOperationContent from '../Feature/OAOperationContent.vue'

const { paths } = defineProps({
  paths: {
    type: Object,
    required: true,
  },
})

const slots = defineSlots<{ [K in OperationSlot | OperationNestedSlot]?: (props: any) => any }>()

// The server renders every operation (full HTML for SEO), but on the client each one hydrates only once it
// is near the viewport, so large specs do not run all their components on load. Client-side renders are
// not affected. The loader resolves immediately: this is about hydration, not code splitting.
const OAOperationContentOnVisible = defineAsyncComponent({
  loader: () => Promise.resolve(OAOperationContent),
  hydrate: hydrateOnVisible({ rootMargin: '400px' }),
})

const operations = Object.entries(paths).reduce((acc: { operationId: string }[], [_, path]) => {
  return [
    ...acc,
    ...Object.keys(path).filter(m => path[m].operationId).map((method) => {
      return {
        operationId: path[method].operationId,
      }
    }),
  ]
}, [])

const lazyRendering = useLazyRendering()

const openapi = injectOpenapi() ?? getGlobalOpenapi()
</script>

<template>
  <template v-if="openapi">
    <OALazy
      v-for="(operation, operationIdx) in operations"
      :key="operation.operationId"
      :is-lazy="lazyRendering && operationIdx > 0"
    >
      <OAOperationContentOnVisible
        :openapi="openapi"
        :operation-id="operation.operationId"
        prefix-headings
        hide-branding
      >
        <!-- Expose all slots upwards -->
        <template
          v-for="(_, name) in slots"
          #[name]="slotProps"
        >
          <slot
            :name="name"
            v-bind="slotProps || {}"
          />
        </template>
      </OAOperationContentOnVisible>

      <hr>
    </OALazy>
  </template>
</template>
