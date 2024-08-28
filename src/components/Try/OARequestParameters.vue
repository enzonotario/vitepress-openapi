<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from 'vue'
import { useOpenapi } from 'vitepress-theme-openapi/composables/useOpenapi'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  request: {
    type: Object,
    default: () => ({
      url: '',
      headers: {},
    }),
  },
})

const emits = defineEmits([
  'update:request',
])

const openapi = useOpenapi()

const baseUrl = openapi.getBaseUrl()

const path = openapi.getOperationPath(props.operationId)

const parameters = openapi.getOperationParameters(props.operationId)

const headerParameters = parameters.filter(parameter => parameter.in === 'header')

const pathParameters = parameters.filter(parameter => parameter.in === 'path')

const queryParameters = parameters.filter(parameter => parameter.in === 'query')

const variables = ref({
  ...headerParameters.reduce((acc, parameter) => {
    acc[parameter.name] = parameter.example ?? parameter.schema?.example ?? ''
    return acc
  }, {}),
  ...pathParameters.reduce((acc, parameter) => {
    acc[parameter.name] = parameter.example ?? parameter.schema?.example ?? ''
    return acc
  }, {}),
  ...queryParameters.reduce((acc, parameter) => {
    acc[parameter.name] = parameter.example ?? parameter.schema?.example ?? ''
    return acc
  }, {}),
})

function buildRequest() {
  let requestPath = path

  for (const [key, value] of Object.entries(variables.value)) {
    if (!pathParameters.find(parameter => parameter.name === key)) {
      continue
    }

    if (!value) {
      continue
    }

    requestPath = requestPath.replace(`{${key}}`, value)
  }

  const url = new URL(requestPath, baseUrl)

  for (const [key, value] of Object.entries(variables.value)) {
    if (!queryParameters.find(parameter => parameter.name === key)) {
      continue
    }

    if (!value) {
      continue
    }

    url.searchParams.set(key, value)
  }

  const headers = new Headers()

  for (const [key, value] of Object.entries(variables.value)) {
    if (!headerParameters.find(parameter => parameter.name === key)) {
      continue
    }

    if (!value) {
      continue
    }

    headers.set(key, value)
  }

  const newRequest = {
    url: url.toString(),
    headers: Object.fromEntries(headers),
  }

  emits('update:request', newRequest)

  return newRequest
}

watch(variables, buildRequest, { deep: true, immediate: true })
</script>

<template>
  <div class="flex flex-col space-y-4">
    <div
      v-if="headerParameters.length"
      class="space-y-4"
    >
      <h4>
        {{ $t('Headers') }}
      </h4>

      <div class="flex flex-col space-y-2">
        <div
          v-for="parameter in headerParameters"
          :key="parameter.name"
          class="flex flex-col gap-2"
        >
          <div class="flex flex-row items-center space-x-2">
            <span class="text-sm font-bold">{{ parameter.name }}</span>
            <span
              v-if="parameter.required"
              class="text-sm text-red-500"
            >*</span>
          </div>
          <div class="flex flex-row items-center space-x-2">
            <OARequestParameterInput
              v-model="variables[parameter.name]"
              :parameter="parameter"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="Object.keys(variables).length"
      class="space-y-4"
    >
      <h4>
        {{ $t('Variables') }}
      </h4>

      <div class="flex flex-col space-y-2">
        <div class="flex flex-row gap-2">
          <div class="w-1/2 flex justify-start">
            <span class="text-xs text-gray-700 dark:text-gray-300 uppercase">{{ $t('Key') }}</span>
          </div>
          <div class="w-1/2 flex justify-start">
            <span class="text-xs text-gray-700 dark:text-gray-300 uppercase">{{ $t('Value') }}</span>
          </div>
        </div>

        <div
          v-for="parameter in [...pathParameters, ...queryParameters]"
          :key="parameter.name"
          class="flex flex-row gap-2"
        >
          <div class="w-1/2 flex flex-row items-center space-x-2">
            <span class="text-sm font-bold">{{ parameter.name }}</span>
            <span
              v-if="parameter.required"
              class="text-sm text-red-500"
            >*</span>
          </div>
          <div class="w-1/2 flex flex-row items-center space-x-2">
            <OARequestParameterInput
              v-model="variables[parameter.name]"
              :parameter="parameter"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
