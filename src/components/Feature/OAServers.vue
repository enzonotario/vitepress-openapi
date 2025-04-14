<script setup>
import OAContextProvider from '../Context/OAContextProvider.vue'
import OAServersContent from './OAServersContent.vue'

const props = defineProps({
  spec: {
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
  <OAServersContent v-if="props.servers" :servers="props.servers" />

  <OAContextProvider v-else :spec="props.spec">
    <template #default="{ openapi }">
      <OAServersContent :servers="openapi.getServers()" />
    </template>
  </OAContextProvider>
</template>
