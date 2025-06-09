<script setup lang="ts">
import type { OperationSlot } from '../../types'
import OAContextProvider from '../Context/OAContextProvider.vue'
import OASpecContent from './OASpecContent.vue'

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
  hideInfo: {
    type: Boolean,
    default: false,
  },
  hideServers: {
    type: Boolean,
    default: false,
  },
  groupByTags: {
    type: Boolean,
    default: null,
  },
  tags: {
    type: Array,
    default: undefined,
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
  hidePathsSummary: {
    type: Boolean,
    default: undefined,
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
      <OASpecContent
        v-bind="{
          ...$attrs,
          openapi,
          hideInfo: props.hideInfo,
          hideServers: props.hideServers,
          groupByTags: props.groupByTags,
          tags: props.tags,
          hideDefaultFooter: props.hideDefaultFooter,
          hideBranding: props.hideBranding,
          hidePathsSummary: props.hidePathsSummary,
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
