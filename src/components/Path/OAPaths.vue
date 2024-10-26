<script setup lang="ts">
import { defineProps } from 'vue'
import OALazy from 'vitepress-openapi/components/Common/Lazy/OALazy.vue'
import type { OperationSlot } from 'vitepress-openapi/types'

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

const slots = defineSlots<OperationSlot>()

const operations = Object.entries(paths).reduce((acc, [_, path]) => {
  return [
    ...acc,
    ...Object.keys(path).filter(m => path[m].operationId).map((method) => {
      return {
        operationId: path[method].operationId,
      }
    }),
  ]
}, [])
</script>

<template>
  <OALazy
    v-for="(operation, operationIdx) in operations"
    :key="operation.operationId"
    :is-lazy="operationIdx > 0"
  >
    <OAOperation
      :operation-id="operation.operationId"
      :openapi="openapi"
      :is-dark="isDark"
      prefix-headings
      hide-default-footer
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
