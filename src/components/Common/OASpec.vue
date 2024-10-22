<script setup>
import { getOpenApiInstance, useTheme } from 'vitepress-openapi'
import OAInfo from 'vitepress-openapi/components/Common/OAInfo.vue'
import OAServers from 'vitepress-openapi/components/Common/OAServers.vue'
import { inject } from 'vue'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
    default: null,
  },
  isDark: {
    type: Boolean,
    default: false,
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
  hideDefaultFooter: {
    type: Boolean,
    default: false,
  },
})

const themeConfig = useTheme()

const openapi = getOpenApiInstance({
  custom: { spec: props.spec },
  injected: inject('openapi', undefined),
})

const servers = openapi.getServers()

const info = openapi.getInfo()

const showInfo = !props.hideInfo && Object.keys(info).length

const showServers = !props.hideServers && servers.length

const groupByTags = props.groupByTags ?? themeConfig.getSpecConfig().groupByTags

const operationsTags = openapi.getOperationsTags()

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
    />
    <OAPaths
      v-else
      :openapi="openapi"
      :paths="paths"
    />

    <OAFooter v-if="!props.hideDefaultFooter" />
  </div>
</template>
