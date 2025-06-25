<script setup lang="ts">
import { usePlaygroundData } from '../../lib/playgroundData'
import OAFooter from '../Common/OAFooter.vue'
import OAOperationPlayground from './OAOperationPlayground.vue'
import OAPlaygroundSidebar from './OAPlaygroundSidebar.vue'

const props = defineProps({
  hideBranding: {
    type: Boolean,
    default: false,
  },
  openapi: {
    type: Object,
    required: true,
  },
})

const slots = defineSlots()

function hasSlot(name: string): boolean {
  return slots[name] !== undefined
}

const { selectedOperation } = usePlaygroundData()
</script>

<template>
  <div class="flex flex-wrap gap-10">
    <template v-if="hasSlot('sidebar')">
      <slot
        name="sidebar"
        :openapi="props.openapi"
      />
    </template>
    <div v-else>
      <OAPlaygroundSidebar
        :openapi="props.openapi"
      />
    </div>

    <template v-if="hasSlot('playground')">
      <slot
        :key="selectedOperation?.operationId"
        name="playground"
        :openapi="props.openapi"
        :operation-id="selectedOperation?.operationId"
      />
    </template>
    <template v-else>
      <div class="vp-doc w-full max-w-3xl flex flex-col gap-10">
        <OAOperationPlayground
          v-if="selectedOperation"
          :key="selectedOperation.operationId"
          :openapi="props.openapi"
          :operation-id="selectedOperation.operationId"
        />
        <div v-else class="flex items-center justify-center h-64 text-gray-500">
          {{ $t('Select an operation to try it out') }}
        </div>

        <OAFooter v-if="!props.hideBranding" />
      </div>
    </template>
  </div>
</template>
