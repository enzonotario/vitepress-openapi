<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import fetchToCurl from 'fetch-to-curl';

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

const request = ref({
  url: `${props.baseUrl}${props.path}`,
  headers: {},
})

const loading = ref(false)

const curl = computed(() => {
  const curlCommand = fetchToCurl({
    method: props.method.toUpperCase(),
    url: request.value.url,
    headers: request.value.headers,
  })

  return curlCommand.replace(/ -(\w) /g, ' \\\n -$1 ')
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <OAPathEndpoint
      v-if="!props.hideEndpoint"
      :method="props.method"
      :path="props.path"
      :base-url="props.baseUrl"
      hide-base-url
    />

    <OARequestParameters
      v-model:request="request"
      :operation-id="props.operationId"
      :method="props.method"
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
      :method="props.method"
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
