<script setup>
import OAProvider from '../Context/OAProvider.vue'
import OAInfoContent from './OAInfoContent.vue'

const props = defineProps({
  spec: {
    type: [Object, String],
    required: false,
  },
})
</script>

<template>
  <OAProvider :spec="props.spec">
    <template #default="{ openapi }">
      <OAInfoContent :openapi="openapi" />
    </template>
  </OAProvider>
</template>
