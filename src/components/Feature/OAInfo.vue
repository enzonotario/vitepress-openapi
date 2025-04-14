<script setup>
import OAContextProvider from '../Context/OAContextProvider.vue'
import OAInfoContent from './OAInfoContent.vue'

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
})
</script>

<template>
  <OAInfoContent v-if="props.info || props.externalDocs" :info="props.info" :external-docs="props.externalDocs" />
  <OAContextProvider v-else :spec="props.spec">
    <template #default="{ openapi }">
      <OAInfoContent :info="openapi.spec.info" :external-docs="openapi.externalDocs" />
    </template>
  </OAContextProvider>
</template>
