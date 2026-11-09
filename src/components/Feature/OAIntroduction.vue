<script setup>
import OADocRoot from '../Common/OADocRoot.vue'
import OAProvider from '../Context/OAProvider.vue'
import OAInfoContent from './OAInfoContent.vue'
import OAServersContent from './OAServersContent.vue'

const props = defineProps({
  spec: {
    type: [Object, String],
    required: false,
  },
})
</script>

<template>
  <OADocRoot>
    <OAProvider :spec="props.spec">
      <template #default="{ openapi }">
        <OAInfoContent :openapi="openapi" />
        <OAServersContent :openapi="openapi" />
      </template>
    </OAProvider>
  </OADocRoot>
</template>
