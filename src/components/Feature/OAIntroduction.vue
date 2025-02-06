<script setup>
import { inject } from 'vue'
import { OPENAPI_GLOBAL_KEY, OPENAPI_LOCAL_KEY } from '../../composables/useOpenapi'
import { getOpenApiInstance } from '../../lib/getOpenApiInstance'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
  },
  openapi: {
    type: Object,
    required: false,
  },
})

const openapi = props.openapi ?? getOpenApiInstance({
  custom: { spec: props.spec },
  injected: inject(OPENAPI_GLOBAL_KEY, undefined),
  injectedLocal: inject(OPENAPI_LOCAL_KEY, undefined),
})
</script>

<template>
  <OAInfo :spec="spec" :openapi="openapi" />
  <OAServers :spec="spec" :openapi="openapi" />
</template>
