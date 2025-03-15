<script setup>
import { createOpenApiInstance } from '../../lib/createOpenApiInstance'
import { fetchSpec } from '../../lib/fetchSpec'
import OAContext from './OAContext.vue'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
  },
  specUrl: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['update:spec'])

const spec = props.spec || await fetchSpec(props.specUrl)

emit('update:spec', spec)

const openapiInstance = createOpenApiInstance({ spec })
</script>

<template>
  <OAContext :openapi="openapiInstance">
    <template #default="{ openapi }">
      <slot :openapi="openapi" />
    </template>
  </OAContext>
</template>
