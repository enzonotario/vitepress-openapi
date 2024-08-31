<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import fetchToCurl from 'vitepress-theme-openapi/utils/fetchToCurl';
import { useOpenapi } from 'vitepress-theme-openapi';
import { propertiesTypesJsonRecursive } from 'vitepress-theme-openapi/utils/generateSchemaJson';

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
  isDark: {
    type: Boolean,
    required: true,
  },
  hideEndpoint: {
    type: Boolean,
    default: false,
  },
})

const request = ref({
  url: `${props.baseUrl}${props.path}`,
  headers: {},
})

const loading = ref(false)

const openapi = useOpenapi()

const operationMethod = openapi.getOperationMethod(props.operationId)

const parsedOperation = openapi.getParsedOperation(props.operationId)

const schemaJson = propertiesTypesJsonRecursive(parsedOperation.requestBody?.content?.['application/json']?.schema, true)

const curl = computed(() => {
  return fetchToCurl({
    method: operationMethod.toUpperCase(),
    url: request.value.url,
    headers: request.value.headers,
    body: schemaJson ? JSON.stringify(schemaJson, null, 2) : undefined,
  })
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <OARequestParameters
      v-model:request="request"
      :operation-id="props.operationId"
      :method="operationMethod"
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
      :method="operationMethod"
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
