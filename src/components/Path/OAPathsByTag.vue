<script setup lang="ts">
import { computed, defineProps, nextTick, ref } from 'vue'
import { getOpenApiInstance } from '../../lib/getOpenApiInstance'
import { useTheme } from '../../composables/useTheme'
import OAPathsSummary from '../Path/OAPathsSummary.vue'
import { Button } from '../ui/button'
import { Collapsible, CollapsibleTrigger } from '../ui/collapsible'
import type { OperationSlot } from '../../types'
import { scrollIntoOperationByOperationId } from '../../lib/utils'

export interface Tag {
  tag: string
  paths: Record<string, any>
  isOpen: boolean
  description?: string
}

const props = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
  tag: {
    type: Object as () => Tag,
    required: true,
  },
  hidePathsSummary: {
    type: Boolean,
    default: undefined,
  },
})

const slots = defineSlots<Record<string, OperationSlot>>()

const themeConfig = useTheme()

const openapi = props.openapi ?? getOpenApiInstance()

const lazyRendering = themeConfig.getSpecConfig()?.lazyRendering?.value

const showPathsSummary = computed(() => props.hidePathsSummary === undefined
  ? themeConfig.getSpecConfig()?.showPathsSummary?.value
  : !props.hidePathsSummary,
)

const hasDescription = computed(() => props.tag?.description && props.tag?.description.trim() !== '')

const isOpen = ref(!themeConfig.getSpecConfig()?.collapsePaths?.value)

function onPathClick(tagPaths: { tag: string, paths: Record<string, any> }, hash: string) {
  isOpen.value = true

  nextTick(() => {
    scrollIntoOperationByOperationId({
      hash,
    })
  })
}
</script>

<template>
  <Collapsible
    v-model:open="isOpen"
  >
    <OAHeading level="h1">
      {{ props.tag.tag }}
    </OAHeading>

    <div
      :class="{ 'md:grid-cols-2': showPathsSummary && hasDescription }"
      class="grid grid-cols-1 gap-10"
    >
      <div v-if="hasDescription">
        <p>
          {{ props.tag.description }}
        </p>
      </div>

      <div
        v-if="showPathsSummary"
        class="flex-1 my-[16px]"
      >
        <OAPathsSummary
          :paths="props.tag.paths"
          @path-click="onPathClick(props.tag, $event)"
        />
      </div>
    </div>

    <div
      v-if="showPathsSummary || themeConfig.getSpecConfig()?.collapsePaths?.value === true"
      class="flex justify-center"
    >
      <CollapsibleTrigger>
        <Button>
          {{ isOpen ? $t('Hide operations') : $t('Show operations') }}
        </Button>
      </CollapsibleTrigger>
    </div>

    <hr>

    <div
      v-if="!lazyRendering || isOpen"
      class="flex flex-col space-y-10"
      :class="[{ hidden: !isOpen }]"
    >
      <OAPaths
        :openapi="openapi"
        :paths="props.tag.paths"
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
      </OAPaths>
    </div>
  </Collapsible>
</template>
