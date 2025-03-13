<script setup>
import { getAsyncOpenApiInstance } from '../../lib/getAsyncOpenApiInstance'
import OAContext from './OAContext.vue'

const props = defineProps({
  spec: {
    type: Object,
    required: true,
  },
})

const openapiInstance = await getAsyncOpenApiInstance({
  custom: { spec: props.spec },
})
</script>

<template>
  <OAContext :openapi="openapiInstance">
    <template #default="{ openapi }">
      <slot :openapi="openapi" />
    </template>
  </OAContext>
</template>
