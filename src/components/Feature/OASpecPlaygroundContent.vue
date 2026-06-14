<script setup lang="ts">
import type { SpecPlaygroundSlot } from '../../types'
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

const slots = defineSlots<{ [K in SpecPlaygroundSlot]?: (props: any) => any }>()

function hasSlot(name: SpecPlaygroundSlot): boolean {
  return slots[name] !== undefined
}

const { selectedOperation } = usePlaygroundData()
</script>

<template>
  <div class="OASpecPlayground">
    <template v-if="hasSlot('sidebar')">
      <slot
        name="sidebar"
        :openapi="props.openapi"
      />
    </template>
    <aside v-else class="OASidebar">
      <OAPlaygroundSidebar
        :openapi="props.openapi"
      />
    </aside>

    <template v-if="hasSlot('playground')">
      <slot
        :key="selectedOperation?.operationId"
        name="playground"
        :openapi="props.openapi"
        :operation-id="selectedOperation?.operationId"
      />
    </template>
    <template v-else>
      <div class="OAContent has-sidebar vp-doc">
        <div class="OADoc w-full max-w-3xl mx-auto flex flex-col space-y-4">
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
      </div>
    </template>
  </div>
</template>
