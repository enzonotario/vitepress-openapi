<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'

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
  hideEndpoint: {
    type: Boolean,
    default: false,
  },
})

const requestUrl = ref(props.requestUrl ?? `${props.baseUrl}${props.path}`)

const loading = ref(false)

const curl = computed(() => {
  return `curl -X ${props.method.toUpperCase()} \\\n ${requestUrl.value}`
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <PathEndpoint v-if="!props.hideEndpoint" :method="props.method" :path="props.path" :baseUrl="props.baseUrl" hide-base-url />

    <RequestParameters v-model:request-url="requestUrl" :operation-id="props.operationId" :method="props.method" :baseUrl="props.baseUrl" :path="props.path" />

    <OACodeBlock :code="curl" lang="bash" label="cURL" :is-dark="props.isDark" />

    <TryItButton :request-url="requestUrl" :operation-id="props.operationId" :method="props.method" @loading="loading = $event">
      <template #response="response">
        <OACodeBlock :code="JSON.stringify(response.response, null, 2)"
                     lang="json"
                     label="JSON"
                     :is-dark="props.isDark"
                     :disable-html-transform="response.response.length > 1000" />
      </template>
    </TryItButton>
  </div>
</template>
