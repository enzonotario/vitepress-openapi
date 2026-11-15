<script setup lang="ts">
import type { OperationSlot, ResponseDescriptionSlotProps } from '../../types'
import { provide } from 'vue'
import { LAZY_RENDERING_KEY } from '../../lib/spec/lazyRendering'
import OADocRoot from '../Common/OADocRoot.vue'
import OAProvider from '../Context/OAProvider.vue'
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
  /**
   * Render only the first operation, and the rest when the browser is idle. Overrides `spec.lazyRendering`
   * of the theme config for this instance, also during SSR (where page-level theme config may not apply).
   */
  lazyRendering: {
    type: Boolean,
    default: undefined,
  },
})

const emits = defineEmits([
  'update:spec',
])

const slots = defineSlots<{ [K in OperationSlot]?: (props: any) => any } & {
  'response-description'?: (props: ResponseDescriptionSlotProps) => any
}>()

provide(LAZY_RENDERING_KEY, props.lazyRendering)
</script>

<template>
  <OADocRoot>
    <OAProvider :spec="props.spec" :spec-url="props.specUrl" @update:spec="emits('update:spec', $event)">
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
    </OAProvider>
  </OADocRoot>
</template>
