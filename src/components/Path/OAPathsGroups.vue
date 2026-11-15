<script setup lang="ts">
import type { OperationNestedSlot, OperationSlot, PathsGroupView } from '../../types'
import { useLazyRendering } from '../../lib/spec/lazyRendering'
import OAPathsGroup from './OAPathsGroup.vue'

const props = defineProps({
  groups: {
    type: Array<PathsGroupView>,
    required: true,
  },
  hidePathsSummary: {
    type: Boolean,
    default: undefined,
  },
})

const slots = defineSlots<{ [K in OperationSlot | OperationNestedSlot]?: (props: any) => any }>()

const lazyRendering = useLazyRendering()
</script>

<template>
  <div class="flex flex-col space-y-10">
    <template v-for="(group, index) in props.groups" :key="group.name">
      <OAPathsGroup
        :group="group"
        :hide-paths-summary="props.hidePathsSummary"
        :is-lazy="lazyRendering && index > 0"
      >
        <!-- Expose all slots upwards -->
        <template v-for="(_, name) in slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}" />
        </template>
      </OAPathsGroup>
    </template>
  </div>
</template>
