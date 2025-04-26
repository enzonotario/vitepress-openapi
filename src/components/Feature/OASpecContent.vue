<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OperationSlot, PathsGroupView } from '../../types'
import { useI18n } from '@byjohann/vue-i18n'
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme'
import OAFooter from '../Common/OAFooter.vue'
import OAPathsGroups from '../Path/OAPathsGroups.vue'
import OAInfoContent from './OAInfoContent.vue'
import OAServersContent from './OAServersContent.vue'

const props = defineProps({
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
  openapi: {
    type: Object,
    required: true,
  },
})

const slots = defineSlots<Record<string, OperationSlot>>()

const { t } = useI18n()

const themeConfig = useTheme()

const servers = props.openapi.getServers()

const info = props.openapi.getInfo()

const showInfo = !props.hideInfo && Object.keys(info).length

const showServers = !props.hideServers && servers.length

const groupByTags = computed(() => props.groupByTags ?? themeConfig.getSpecConfig()?.groupByTags?.value)

const operationsTags = computed(() => props.tags ?? props.openapi.getOperationsTags())

const specTags: OpenAPIV3.TagObject[] = props.openapi.getTags()

const paths = props.openapi.getPaths()

const pathsByTags = computed(() => operationsTags.value.map((tag: string) => {
  return {
    tag,
    paths: props.openapi.getPathsByTags(tag),
  }
}))
const pathsWithoutTags = props.openapi.getPathsWithoutTags()

const groups = computed(() => {
  if (groupByTags.value) {
    return [
      ...(Object.keys(pathsWithoutTags).length
        ? [
            {
              name: t(useTheme().getSpecConfig()?.defaultTag ?? 'Default'),
              paths: pathsWithoutTags,
              isOpen: !themeConfig.getSpecConfig()?.collapsePaths?.value,
              isGrouped: true,
            },
          ]
        : []),

      ...pathsByTags.value.map((tag: { tag: string, paths: Record<string, any> }) => {
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
      <OAInfoContent v-if="showInfo" :openapi="openapi" />

      <OAServersContent v-if="showServers" :openapi="openapi" />
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
