<script setup>
import OAContextProvider from './OAContextProvider.vue'
import OAInfoContent from './OAInfoContent.vue'
import OAServersContent from './OAServersContent.vue'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
  },
})
</script>

<template>
  <OAContextProvider :spec="props.spec">
    <template #default="{ openapi }">
      <OAInfoContent :openapi="openapi" />
      <OAServersContent :openapi="openapi" />
    </template>
  </OAContextProvider>
</template>
