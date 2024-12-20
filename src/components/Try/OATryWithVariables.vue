<script setup lang="ts">
import { computed, defineEmits, defineProps, ref } from 'vue'
import type { OpenAPIV3 } from '@scalar/openapi-types'
import { OARequest } from '../../lib/codeSamples/request'
import OAPlaygroundResponse from '../Playground/OAPlaygroundResponse.vue'
import OAPlaygroundParameters from '../Playground/OAPlaygroundParameters.vue'

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
  isDark: {
    type: Boolean,
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
    default: () => (new OARequest()),
  },
})

const emits = defineEmits([
  'update:request',
  'update:selectedServer',
])

const loading = ref(false)

const schemaUiContentType = computed(() => {
  return props.requestBody?.content?.[props.contentType]?.uiContentType
})

const hasSchemaVariables = computed(() =>
  Object.keys(schemaUiContentType.value?.variables ?? {}).length > 0,
)

const hasSecuritySchemes = computed(() =>
  Object.keys(props.securityUi ?? {}).length > 0,
)

const hasParameters = computed(() =>
  Boolean(props.parameters?.length || hasSchemaVariables.value || hasSecuritySchemes.value),
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
    :schema-ui-content-type="schemaUiContentType"
    :is-dark="props.isDark"
    @update:request="($event: any) => emits('update:request', $event)"
    @update:selected-server="($event: any) => emits('update:selectedServer', $event)"
  />

  <OATryItButton
    :request="props.request"
    :operation-id="props.operationId"
    :path="props.path"
    :method="props.method"
    :base-url="props.baseUrl"
    :is-dark="props.isDark"
    @loading="loading = $event"
  >
    <template #response="response">
      <OAPlaygroundResponse
        :response="response.response"
        :is-dark="response.isDark"
      />
    </template>
  </OATryItButton>
</template>
