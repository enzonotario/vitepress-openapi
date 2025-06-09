<script setup lang="ts">
import type { OperationSlot } from '../../types'
import OAContextProvider from '../Context/OAContextProvider.vue'
import OAOperationContent from './OAOperationContent.vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  spec: {
    type: [Object, String],
    required: false,
  },
  specUrl: {
    type: String,
    required: false,
    default: null,
  },
  prefixHeadings: {
    // Whether to add prefixes to component headings (for the One Page view)
    type: Boolean,
    default: false,
  },
  hideDefaultFooter: {
    /**
     * @deprecated Use `hideBranding` instead
     */
    type: Boolean,
    default: undefined,
  },
  hideBranding: {
    type: Boolean,
    default: (props: { hideBranding?: boolean, hideDefaultFooter?: boolean }) => {
      if (props.hideBranding === undefined && props.hideDefaultFooter !== undefined) {
        console.warn(
          '`hideDefaultFooter` is deprecated. Use `hideBranding` instead.',
        )

        return props.hideDefaultFooter
      }

      return false
    },
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
      <OAOperationContent
        v-bind="{
          ...$attrs,
          operationId: props.operationId,
          openapi,
          prefixHeadings: props.prefixHeadings,
          hideBranding: props.hideBranding,
          hideDefaultFooter: props.hideDefaultFooter,
        }"
      >
        <!-- Expose all slots upwards -->
        <template v-for="(_, name) in slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}" />
        </template>
      </OAOperationContent>
    </template>
  </OAContextProvider>
</template>
