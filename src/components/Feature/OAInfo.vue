<script setup>
import OAContextProvider from '../Context/OAContextProvider.vue'
import OAInfoContent from './OAInfoContent.vue'

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
    </template>
  </OAContextProvider>
</template>
