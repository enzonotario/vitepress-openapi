<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'
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
  securitySchemes: {
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
</script>

<template>
  <div class="flex flex-col space-y-2">
    <OAPlaygroundParameters
      :request="props.request"
      :operation-id="props.operationId"
      :path="props.path"
      :method="props.method"
      :base-url="props.baseUrl"
      :parameters="props.parameters ?? []"
      :security-schemes="props.securitySchemes ?? {}"
      :schema-ui-content-type="props.requestBody?.content?.[props.contentType]?.uiContentType"
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
  </div>
</template>
