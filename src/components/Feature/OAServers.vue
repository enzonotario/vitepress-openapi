<script setup>
import OAContextProvider from '../Context/OAContextProvider.vue'
import OAServersContent from './OAServersContent.vue'

const props = defineProps({
  spec: {
    type: [Object, String],
    required: false,
  },
})
</script>

<template>
  <OAContextProvider :spec="props.spec">
    <template #default="{ openapi }">
      <OAServersContent :openapi="openapi" />
    </template>
  </OAContextProvider>
</template>
