<script setup>
import { inject } from 'vue'
import { getOpenApiInstance } from '../../lib/getOpenApiInstance.js'

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
  injected: inject('openapi', undefined),
})
</script>

<template>
  <OAInfo :spec="spec" :openapi="openapi" />
  <OAServers :spec="spec" :openapi="openapi" />
</template>
