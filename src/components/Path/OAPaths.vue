<script setup lang="ts">
import type { OperationSlot } from '../../types'
import { defineProps } from 'vue'
import { useTheme } from '../../composables/useTheme'
import OALazy from '../Common/Lazy/OALazy.vue'

const { openapi, paths } = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
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
</script>

<template>
  <OALazy
    v-for="(operation, operationIdx) in operations"
    :key="operation.operationId"
    :is-lazy="lazyRendering && operationIdx > 0"
  >
    <OAOperation
      :operation-id="operation.operationId"
      :openapi="openapi"
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
    </OAOperation>

    <hr>
  </OALazy>
</template>
