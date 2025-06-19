<script setup lang="ts">
import type { OperationSlot } from '../../types'
import OAContextProvider from '../Context/OAContextProvider.vue'
import OAPlaygroundContext from './OAPlaygroundContext.vue'
import OASpecPlaygroundContent from './OASpecPlaygroundContent.vue'

const props = defineProps({
  spec: {
    type: [Object, String],
    required: false,
    default: null,
  },
  specUrl: {
    type: String,
    required: false,
    default: null,
  },
  hideBranding: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits([
  'update:spec',
])

const slots = defineSlots<Record<string, OperationSlot>>()
</script>

<template>
  <OAContextProvider :spec="props.spec" :spec-url="props.specUrl" @update:spec="emits('update:spec', $event)">
    <template #default="{ openapi }">
      <OAPlaygroundContext :openapi="openapi">
        <OASpecPlaygroundContent
          v-bind="{
            ...$attrs,
            openapi,
            hideBranding: props.hideBranding,
          }"
        >
          <!-- Expose all slots upwards -->
          <template v-for="(_, name) in slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}" />
          </template>
        </OASpecPlaygroundContent>
      </OAPlaygroundContext>
    </template>
  </OAContextProvider>
</template>
