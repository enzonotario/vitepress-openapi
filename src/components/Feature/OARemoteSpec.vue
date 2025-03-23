<script setup lang="ts">
import type { OperationSlot } from '../../types'
import OAContextProvider from '../Context/OAContextProvider.vue'
import OASpecContent from './OASpecContent.vue'

const props = defineProps({
  specUrl: {
    type: String,
    required: true,
  },
})

const emits = defineEmits([
  'update:spec',
])

const slots = defineSlots<Record<string, OperationSlot>>()
</script>

<template>
  <OAContextProvider :spec-url="props.specUrl" @update:spec="emits('update:spec', $event)">
    <template #default="{ openapi }">
      <OASpecContent
        v-bind="{
          ...$attrs,
          openapi,
        }"
      >
        <!-- Expose all slots upwards -->
        <template v-for="(_, name) in slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}" />
        </template>
      </OASpecContent>
    </template>
  </OAContextProvider>
</template>
