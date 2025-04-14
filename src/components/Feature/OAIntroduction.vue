<script setup>
import OAContextProvider from '../Context/OAContextProvider.vue'
import OAInfoContent from './OAInfoContent.vue'
import OAServersContent from './OAServersContent.vue'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
  },
  info: {
    type: Object,
    required: false,
  },
  externalDocs: {
    type: Object,
    required: false,
  },
  servers: {
    type: Array,
    required: false,
  },
})
</script>

<template>
  <template v-if="props.info || props.externalDocs || props.servers">
    <OAInfoContent
      v-if="props.info || props.externalDocs"
      :info="props.info"
      :external-docs="props.externalDocs"
    />
    <OAServersContent
      v-if="props.servers"
      :servers="props.servers"
    />
  </template>
  <OAContextProvider v-else :spec="props.spec">
    <template #default="{ openapi }">
      <OAInfoContent :info="openapi.spec.info" :external-docs="openapi.externalDocs" />
      <OAServersContent :servers="openapi.getServers()" />
    </template>
  </OAContextProvider>
</template>
