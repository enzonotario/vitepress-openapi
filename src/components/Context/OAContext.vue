<script setup>
import { provide } from 'vue'
import { OPENAPI_LOCAL_KEY } from '../../composables/useOpenapi'
import { getAsyncOpenApiInstance } from '../../lib/getAsyncOpenApiInstance'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
    default: null,
  },
})

const openapi = await getAsyncOpenApiInstance({
  custom: { spec: props.spec },
})

provide(OPENAPI_LOCAL_KEY, openapi)
</script>

<template>
  <slot :openapi="openapi" />
</template>
