<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { OpenAPIV3 } from '@scalar/openapi-types'
import { getOpenApiInstance } from '../../lib/getOpenApiInstance'
import { useTheme } from '../../composables/useTheme'
import OALazy from '../Common/Lazy/OALazy.vue'
import type { OperationSlot } from '../../types'
import OAPathsByTag from './OAPathsByTag.vue'

const props = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
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
})

const slots = defineSlots<Record<string, OperationSlot>>()

const { t } = useI18n()

const themeConfig = useTheme()

const openapi = props.openapi ?? getOpenApiInstance()

const specTags: OpenAPIV3.TagObject[] = openapi.getTags()

const operationsTags = props.tags ?? openapi.getOperationsTags()

const pathsByTags = operationsTags.map((tag: string) => {
  return {
    tag,
    paths: openapi.getPathsByTags(tag),
  }
})

const pathsWithoutTags = openapi.getPathsWithoutTags()

const internalTags = ref([
  ...(pathsWithoutTags.length
    ? [
        {
          tag: t(useTheme().getSpecConfig()?.defaultTag ?? 'Default'),
          paths: pathsWithoutTags,
          // isOpen: !themeConfig.getSpecConfig()?.collapsePaths?.value,
        },
      ]
    : []),

  ...pathsByTags.map((tag: { tag: string, paths: Record<string, any> }) => {
    return {
      tag: tag.tag,
      paths: tag.paths,
      // isOpen: !themeConfig.getSpecConfig()?.collapsePaths?.value,
      description: specTags.find(tagInfo => tagInfo.name === tag.tag)?.description,
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
      :openapi="openapi"
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
