<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OperationSlot, PathsGroupView } from '../../types'
import { computed, inject, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { OPENAPI_GLOBAL_KEY, OPENAPI_LOCAL_KEY } from '../../composables/useOpenapi'
import { useTheme } from '../../composables/useTheme'
import { getOpenApiInstance } from '../../lib/getOpenApiInstance'
import OAPathsGroups from '../Path/OAPathsGroups.vue'
import OAInfo from './OAInfo.vue'
import OAServers from './OAServers.vue'

const props = defineProps({
  spec: {
    type: Object,
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

const slots = defineSlots<Record<string, OperationSlot>>()

const { t } = useI18n()

const themeConfig = useTheme()

const openapi = getOpenApiInstance({
  custom: { spec: props.spec },
  injected: inject(OPENAPI_GLOBAL_KEY, undefined),
  injectedLocal: inject(OPENAPI_LOCAL_KEY, undefined),
})

provide(OPENAPI_LOCAL_KEY, openapi)

const servers = openapi.getServers()

const info = openapi.getInfo()

const showInfo = !props.hideInfo && Object.keys(info).length

const showServers = !props.hideServers && servers.length

const groupByTags = computed(() => props.groupByTags ?? themeConfig.getSpecConfig()?.groupByTags?.value)

const operationsTags = props.tags ?? openapi.getOperationsTags()

const specTags: OpenAPIV3.TagObject[] = openapi.getTags()

const paths = openapi.getPaths()

const pathsByTags = operationsTags.map((tag: string) => {
  return {
    tag,
    paths: openapi.getPathsByTags(tag),
  }
})

const pathsWithoutTags = openapi.getPathsWithoutTags()

const groups = computed(() => {
  if (groupByTags.value) {
    return [
      ...(pathsWithoutTags.length
        ? [
            {
              name: t(useTheme().getSpecConfig()?.defaultTag ?? 'Default'),
              paths: pathsWithoutTags,
              isOpen: !themeConfig.getSpecConfig()?.collapsePaths?.value,
              isGrouped: true,
            },
          ]
        : []),

      ...pathsByTags.map((tag: { tag: string, paths: Record<string, any> }) => {
        return {
          name: tag.tag,
          paths: tag.paths,
          isOpen: !themeConfig.getSpecConfig()?.collapsePaths?.value,
          description: specTags.find(tagInfo => tagInfo.name === tag.tag)?.description,
          isGrouped: true,
        }
      }),
    ] as PathsGroupView[]
  }

  return [
    {
      name: t(useTheme().getSpecConfig()?.defaultTag ?? 'Default'),
      paths,
      isGrouped: false,
    },
  ] as PathsGroupView[]
})
</script>

<template>
  <div class="flex flex-col space-y-10">
    <div v-if="showInfo || showServers">
      <OAInfo v-if="showInfo" :openapi="openapi" />

      <OAServers v-if="showServers" :openapi="openapi" />
    </div>

    <hr v-if="showInfo || showServers">

    <OAPathsGroups :groups="groups" :hide-paths-summary="props.hidePathsSummary">
      <!-- Expose all slots upwards -->
      <template v-for="(_, name) in slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}" />
      </template>
    </OAPathsGroups>

    <OAFooter v-if="!props.hideBranding" />
  </div>
</template>
