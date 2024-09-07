<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import fetchToCurl from 'vitepress-theme-openapi/lib/fetchToCurl';
import { generateSchemaJson } from 'vitepress-theme-openapi/lib/generateSchemaJson';

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

const schemaJson = props.schema ? generateSchemaJson(props.schema, true) : null

const curl = computed(() => {
  return fetchToCurl({
    method: props.method.toUpperCase(),
    url: request.value.url,
    headers: request.value.headers,
    body: schemaJson && Object.keys(schemaJson).length ? JSON.stringify(schemaJson, null, 2) : undefined,
  })
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <OARequestParameters
      v-model:request="request"
      :operation-id="props.operationId"
      :path="props.path"
      :method="props.method"
      :base-url="props.baseUrl"
      :parameters="props.schema?.parameters ?? []"
      :security-schemes="props.securitySchemes ?? {}"
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
        <OACodeBlock
          :code="JSON.stringify(response.response, null, 2)"
          lang="json"
          label="JSON"
          :is-dark="props.isDark"
          :disable-html-transform="response.response.length > 1000"
        />
      </template>
    </OATryItButton>
  </div>
</template>
