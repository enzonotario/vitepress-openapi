<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'
import { computed, defineEmits, defineProps, ref } from 'vue'
import OAPlaygroundParameters from './OAPlaygroundParameters.vue'
import OAPlaygroundResponse from './OAPlaygroundResponse.vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  hideEndpoint: {
    type: Boolean,
    default: false,
  },
  parameters: {
    type: Array<OpenAPIV3.ParameterObject>,
    required: false,
  },
  requestBody: {
    type: Object,
    required: false,
  },
  securityUi: {
    type: Object,
    required: true,
  },
  contentType: {
    type: String,
    required: false,
    default: 'application/json',
  },
  request: {
    type: Object,
  },
})

const emits = defineEmits([
  'update:request',
  'update:selectedServer',
])

const loading = ref(false)

const schemaExamples = computed(() => {
  return props.requestBody?.content?.[props.contentType]?.examples
})

const hasBody = computed(() =>
  Boolean(props.requestBody),
)

const hasSecuritySchemes = computed(() =>
  Object.keys(props.securityUi ?? {}).length > 0,
)

const hasParameters = computed(() =>
  Boolean(props.parameters?.length || hasBody.value || hasSecuritySchemes.value),
)
</script>

<template>
  <OAPlaygroundParameters
    v-if="hasParameters"
    :request="props.request"
    :operation-id="props.operationId"
    :path="props.path"
    :method="props.method"
    :base-url="props.baseUrl"
    :parameters="props.parameters ?? []"
    :security-ui="props.securityUi ?? {}"
    :examples="schemaExamples"
    @update:request="($event: any) => emits('update:request', $event)"
    @update:selected-server="($event: any) => emits('update:selectedServer', $event)"
  />

  <OATryItButton
    :request="props.request"
    :operation-id="props.operationId"
    :path="props.path"
    :method="props.method"
    :base-url="props.baseUrl"
    @loading="loading = $event"
  >
    <template #response="response">
      <OAPlaygroundResponse
        :response="response.response"
      />
    </template>
  </OATryItButton>
</template>
