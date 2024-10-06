<script setup>
import { OpenApi, useOpenapi } from 'vitepress-openapi'
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
})

const openapi = OpenApi({ spec: props.spec || useOpenapi().json })

const paths = openapi.getPaths()

const info = openapi.getInfo()

const externalDocs = openapi.getExternalDocs()

const servers = openapi.getServers()

const showInfo = !props.hideInfo && Object.keys(info).length

const showServers = !props.hideServers && servers.length
</script>

<template>
  <div class="flex flex-col space-y-10">
    <div v-if="showInfo || showServers">
      <OAInfo
        v-if="showInfo"
        :info="info"
        :external-docs="externalDocs"
      />

      <OAServers
        v-if="showServers"
        :spec="props.spec"
        :servers="servers"
      />
    </div>

    <hr v-if="showInfo || showServers">

    <div
      v-for="path in paths"
      :key="path.id"
      class="flex flex-col space-y-10"
    >
      <template v-for="method in Object.keys(path)">
        <OAOperation
          v-if="path[method].operationId"
          :key="`${method}-${path.id}`"
          :operation-id="path[method].operationId"
          :spec="props.spec"
          :is-dark="props.isDark"
          prefix-headings
          hide-default-footer
        />
      </template>

      <hr>
    </div>

    <OAFooter />
  </div>
</template>
