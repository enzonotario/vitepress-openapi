<script setup>
import { fetchSpec } from '../../lib/fetchSpec'
import { getAsyncOpenApiInstance } from '../../lib/getAsyncOpenApiInstance'
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

const openapiInstance = await getAsyncOpenApiInstance({
  custom: { spec },
})
</script>

<template>
  <OAContext :openapi="openapiInstance">
    <template #default="{ openapi }">
      <slot :openapi="openapi" />
    </template>
  </OAContext>
</template>
