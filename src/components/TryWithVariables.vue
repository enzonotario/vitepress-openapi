<script setup lang="ts">
import {defineProps, ref, watch} from 'vue'
import {codeToHtml} from 'shikiji'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  method: {
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
})

const requestUrl = ref(props.requestUrl ?? `${props.baseUrl}${props.path}`)

const html = ref(null)

const responseHtml = ref(null)

const theme = props.isDark ? 'github-dark' : 'github-light'

const loading = ref(false)

async function setupCodeSample() {
  const curl = `curl -X ${props.method.toUpperCase()} \\\n ${requestUrl.value}`

  html.value = await codeToHtml(curl, {
    lang: 'bash',
    theme,
  })
}

async function formatResponse(response) {
  // If the response is too large, don't format it
  if (response.length > 1000) {
    responseHtml.value = JSON.stringify(response, null, 2)
    return
  }

  responseHtml.value = await codeToHtml(JSON.stringify(response, null, 2), {
    lang: 'json',
    theme,
  })
}

watch(requestUrl, () => {
  setupCodeSample()
}, {
  immediate: true,
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <OperationEndpoint :method="props.method" :path="props.path" :baseUrl="props.baseUrl" hide-base-url />

    <RequestParameters v-model:request-url="requestUrl" :operation-id="props.operationId" :method="props.method" :baseUrl="props.baseUrl" :path="props.path" />

    <pre v-if="html" class="p-2 border border-gray-200 dark:border-gray-700 rounded overflow-x-auto" v-html="html" />

    <TryItButton :request-url="requestUrl" :operation-id="props.operationId" :method="props.method" @response="formatResponse" @loading="loading = $event">
      <template #response="response">
        <pre class="p-2 border border-gray-200 dark:border-gray-700 rounded overflow-x-auto" v-html="loading ? 'Cargando... ' : responseHtml" />
      </template>
    </TryItButton>
  </div>
</template>
