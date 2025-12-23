<script setup lang="ts">
import type { OperationSlot } from '../../types'
import { defineProps } from 'vue'
import { getGlobalOpenapi, injectOpenapi } from '../../composables/useOpenapi'
import { useTheme } from '../../composables/useTheme'
import OALazy from '../Common/Lazy/OALazy.vue'
import OAOperationContent from '../Feature/OAOperationContent.vue'

const { paths } = defineProps({
  paths: {
    type: Object,
    required: true,
  },
})

const slots = defineSlots<Record<string, OperationSlot>>()

const themeConfig = useTheme()

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

const lazyRendering = themeConfig.getSpecConfig()?.lazyRendering?.value

const openapi = injectOpenapi() ?? getGlobalOpenapi()
</script>

<template>
  <template v-if="openapi">
    <OALazy
      v-for="(operation, operationIdx) in operations"
      :key="operation.operationId"
      :is-lazy="lazyRendering && operationIdx > 0"
    >
      <OAOperationContent
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
      </OAOperationContent>

      <hr>
    </OALazy>
  </template>
</template>
