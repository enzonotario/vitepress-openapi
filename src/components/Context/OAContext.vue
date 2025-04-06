<script setup>
import { provide } from 'vue'
import { OPENAPI_LOCAL_KEY } from '../../composables/useOpenapi'

const props = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
})

provide(OPENAPI_LOCAL_KEY, props.openapi)
</script>

<template>
  <slot :openapi="props.openapi" />
</template>
