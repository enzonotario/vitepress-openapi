<script setup>
import OAProvider from '../Context/OAProvider.vue'
import OAServersContent from './OAServersContent.vue'

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
      <OAServersContent :openapi="openapi" />
    </template>
  </OAProvider>
</template>
