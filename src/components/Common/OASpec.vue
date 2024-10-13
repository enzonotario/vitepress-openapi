<script setup>
import { OpenApi, useOpenapi, useTheme } from 'vitepress-openapi'
import OAInfo from 'vitepress-openapi/components/Common/OAInfo.vue'
import OAServers from 'vitepress-openapi/components/Common/OAServers.vue'

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

const spec = props.spec || useOpenapi().json

const openapi = OpenApi({ spec })

const parsedSpec = openapi.getParsedSpec()

const servers = openapi.getServers()

const info = openapi.getInfo()

const showInfo = !props.hideInfo && Object.keys(info).length

const showServers = !props.hideServers && servers.length

const groupByTags = props.groupByTags ?? themeConfig.getSpecConfig().groupByTags
</script>

<template>
  <div class="flex flex-col space-y-10">
    <div v-if="showInfo || showServers">
      <OAInfo v-if="showInfo" :spec="spec" />

      <OAServers v-if="showServers" :spec="spec" :servers="servers" />
    </div>

    <hr v-if="showInfo || showServers">

    <OAPathsByTags
      v-if="groupByTags && openapi.getOperationsTags().length"
      :spec="spec"
      :parsed-spec="parsedSpec"
      :paths="openapi.getPaths()"
    />
    <OAPaths
      v-else
      :spec="spec"
      :parsed-spec="parsedSpec"
      :paths="openapi.getPaths()"
    />

    <OAFooter v-if="!props.hideDefaultFooter" />
  </div>
</template>
