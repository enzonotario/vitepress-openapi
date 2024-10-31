<script setup lang="ts">
import { computed, defineEmits, defineProps, ref } from 'vue'
import fetchToCurl from 'vitepress-openapi/lib/fetchToCurl'
import { formatJson } from 'vitepress-openapi/lib/formatJson'
import OAPlaygroundResponse from 'vitepress-openapi/components/Playground/OAPlaygroundResponse.vue'
import OAPlaygroundParameters from 'vitepress-openapi/components/Playground/OAPlaygroundParameters.vue'
import { OARequest } from 'vitepress-openapi/lib/codeSamples/request'

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
    type: Object,
    required: false,
  },
  schema: {
    type: Object,
    required: false,
  },
  securitySchemes: {
    type: Object,
    required: true,
  },
  request: {
    type: Object,
    default: () => (new OARequest()),
  },
})

const emits = defineEmits([
  'update:request',
])

const loading = ref(false)

const curl = computed(() => {
  return fetchToCurl({
    method: props.method.toUpperCase(),
    url: props.request.url,
    headers: {
      ...props.request.headers,
      ...(!props.request.headers?.['Content-Type'] ? { 'Content-Type': 'application/json' } : {}),
    },
    body: props.request.body ? formatJson(props.request.body) : null,
  })
})
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
      :schema="props.schema"
      :is-dark="props.isDark"
      @update:request="($event) => $emit('update:request', $event)"
    />

    <OACodeBlock
      :code="curl"
      lang="bash"
      label="cURL"
      :is-dark="props.isDark"
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
