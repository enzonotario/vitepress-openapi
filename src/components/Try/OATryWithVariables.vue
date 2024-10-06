<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import fetchToCurl from 'vitepress-openapi/lib/fetchToCurl'
import { formatJson } from 'vitepress-openapi/lib/formatJson'
import OAPlaygroundResponse from 'vitepress-openapi/components/Playground/OAPlaygroundResponse.vue'
import OAPlaygroundParameters from 'vitepress-openapi/components/Playground/OAPlaygroundParameters.vue'

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
})

const request = ref({
  url: `${props.baseUrl}${props.path}`,
  headers: {},
})

const loading = ref(false)

const curl = computed(() => {
  return fetchToCurl({
    method: props.method.toUpperCase(),
    url: request.value.url,
    headers: {
      ...request.value.headers,
      ...(request.value.body
        ? {
            'Content-Type': 'application/json',
          }
        : {}),
    },
    body: request.value.body ? formatJson(request.value.body) : null,
  })
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <OAPlaygroundParameters
      v-model:request="request"
      :operation-id="props.operationId"
      :path="props.path"
      :method="props.method"
      :base-url="props.baseUrl"
      :parameters="props.parameters ?? []"
      :security-schemes="props.securitySchemes ?? {}"
      :schema="props.schema"
      :is-dark="props.isDark"
    />

    <OACodeBlock
      :code="curl"
      lang="bash"
      label="cURL"
      :is-dark="props.isDark"
    />

    <OATryItButton
      :request="request"
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
