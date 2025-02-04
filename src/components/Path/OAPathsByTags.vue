<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OperationSlot } from '../../types'
import { defineProps, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '../../composables/useTheme'
import OALazy from '../Common/Lazy/OALazy.vue'
import OAPathsByTag from './OAPathsByTag.vue'

const props = defineProps({
  tags: {
    type: Array,
    required: false,
  },
  paths: {
    type: Object,
    required: true,
  },
  hidePathsSummary: {
    type: Boolean,
    default: undefined,
  },
  operationsTags: {
    type: Array,
    required: true,
  },
  specTags: {
    type: Array<OpenAPIV3.TagObject>,
    required: true,
  },
  pathsByTags: {
    type: Array,
    required: true,
  },
  pathsWithoutTags: {
    type: Object,
    required: true,
  },
})

const slots = defineSlots<Record<string, OperationSlot>>()

const { t } = useI18n()

const themeConfig = useTheme()

const internalTags = ref([
  ...(props.pathsWithoutTags.length
    ? [
        {
          tag: t(useTheme().getSpecConfig()?.defaultTag ?? 'Default'),
          paths: props.pathsWithoutTags,
          isOpen: !themeConfig.getSpecConfig()?.collapsePaths?.value,
        },
      ]
    : []),

  ...props.pathsByTags.map((tag: { tag: string, paths: Record<string, any> }) => {
    return {
      tag: tag.tag,
      paths: tag.paths,
      isOpen: !themeConfig.getSpecConfig()?.collapsePaths?.value,
      description: props.specTags.find(tagInfo => tagInfo.name === tag.tag)?.description,
    }
  }),
])

const lazyRendering = themeConfig.getSpecConfig()?.lazyRendering?.value
</script>

<template>
  <OALazy
    v-for="(tagObject, tagIdx) in internalTags"
    :key="tagObject.tag"
    :is-lazy="lazyRendering && tagIdx > 0"
  >
    <OAPathsByTag
      v-if="Object.keys(tagObject.paths).length"
      :tag="tagObject"
      :hide-paths-summary="props.hidePathsSummary"
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
    </OAPathsByTag>
  </OALazy>
</template>
