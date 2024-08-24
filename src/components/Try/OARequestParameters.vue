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
  requestUrl: {
    type: String,
  },
})

const emits = defineEmits([
  'update:requestUrl',
])

const openapi = useOpenapi()

const baseUrl = openapi.getBaseUrl()

const path = openapi.getOperationPath(props.operationId)

const parameters = openapi.getOperationParameters(props.operationId)

const pathParameters = parameters.filter(parameter => parameter.in === 'path')

const queryParameters = parameters.filter(parameter => parameter.in === 'query')

const variables = ref({
  ...pathParameters.reduce((acc, parameter) => {
    acc[parameter.name] = parameter.example ?? parameter.schema?.example ?? ''
    return acc
  }, {}),
  ...queryParameters.reduce((acc, parameter) => {
    acc[parameter.name] = parameter.example ?? parameter.schema?.example ?? ''
    return acc
  }, {}),
})

function buildRequestUrl() {
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
    if (pathParameters.find(parameter => parameter.name === key)) {
      continue
    }

    if (!value) {
      continue
    }

    url.searchParams.set(key, value)
  }

  emits('update:requestUrl', url.toString())

  return url.toString()
}

watch(variables, buildRequestUrl, { deep: true, immediate: true })
</script>

<template>
  <div class="flex flex-col space-y-2">
    <div
      v-if="pathParameters.length"
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
