<script setup lang="ts">
import type { OperationSlot } from '../../types'
import { inject } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { getOpenApiInstance } from '../../lib/getOpenApiInstance'
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

const themeConfig = useTheme()

const openapi = getOpenApiInstance({
  custom: { spec: props.spec },
  injected: inject('openapi', undefined),
})

const servers = openapi.getServers()

const info = openapi.getInfo()

const showInfo = !props.hideInfo && Object.keys(info).length

const showServers = !props.hideServers && servers.length

const groupByTags = props.groupByTags ?? themeConfig.getSpecConfig()?.groupByTags

const operationsTags = props.tags ?? openapi.getOperationsTags()

const paths = openapi.getPaths()
</script>

<template>
  <div class="flex flex-col space-y-10">
    <div v-if="showInfo || showServers">
      <OAInfo v-if="showInfo" :openapi="openapi" />

      <OAServers v-if="showServers" :openapi="openapi" />
    </div>

    <hr v-if="showInfo || showServers">

    <OAPathsByTags
      v-if="groupByTags && operationsTags.length"
      :openapi="openapi"
      :tags="operationsTags"
      :paths="paths"
      :hide-paths-summary="props.hidePathsSummary === undefined ? undefined : props.hidePathsSummary"
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
    </OAPathsByTags>
    <OAPaths
      v-else
      :openapi="openapi"
      :paths="paths"
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

    <OAFooter v-if="!props.hideBranding" />
  </div>
</template>
