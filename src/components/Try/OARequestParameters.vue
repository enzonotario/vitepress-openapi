<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import OAJSONEditor from 'vitepress-theme-openapi/components/Common/OAJSONEditor.vue'
import { propertiesTypesJsonRecursive } from 'vitepress-theme-openapi/lib/generateSchemaJson'
import { usePlayground, useTheme } from 'vitepress-theme-openapi'
import { useStorage } from '@vueuse/core'

interface SecurityScheme {
  type: string
  scheme?: string
  name?: string
  in?: string
}

const props = defineProps({
  request: { // v-model
    type: Object,
    default: () => ({
      url: '',
      headers: {},
    }),
  },
  operationId: {
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
  baseUrl: {
    type: String,
    required: true,
  },
  parameters: {
    type: Array,
    required: true,
  },
  securitySchemes: {
    type: Object,
    required: true,
  },
  schema: {
    type: Object,
    required: false,
  },
})

const emits = defineEmits([
  'update:request',
])

const playground = usePlayground()

const themeConfig = useTheme()

const headerParameters = props.parameters.filter(parameter => parameter && parameter.in === 'header')

const pathParameters = props.parameters.filter(parameter => parameter && parameter.in === 'path')

const queryParameters = props.parameters.filter(parameter => parameter && parameter.in === 'query')

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

const selectedSchemeName = computed(() => {
  return themeConfig.securityConfig.selectedScheme.value
})

const selectedScheme = computed(() => {
  return props.securitySchemes[selectedSchemeName.value]
})

const authScheme = ref(null)

const body = ref(props.schema ? propertiesTypesJsonRecursive(props.schema, true) : null)

function buildRequest() {
  let requestPath = props.path

  for (const [key, value] of Object.entries(variables.value)) {
    if (!pathParameters.find(parameter => parameter.name === key)) {
      continue
    }

    if (!value) {
      continue
    }

    requestPath = requestPath.replace(`{${key}}`, value)
  }

  const url = new URL(`${props.baseUrl}${requestPath}`)

  for (const [key, value] of Object.entries(variables.value)) {
    if (!queryParameters.find(parameter => parameter.name === key)) {
      continue
    }

    if (!value) {
      continue
    }

    url.searchParams.set(key, value)
  }

  const headers = new Headers({})

  for (const [key, value] of Object.entries(variables.value)) {
    if (!headerParameters.find(parameter => parameter.name === key)) {
      continue
    }

    if (!value) {
      continue
    }

    headers.set(key, value)
  }

  if (authScheme.value) {
    switch (authScheme.value.type) {
      case 'http':
        headers.set('Authorization', `${authScheme.value.scheme === 'basic' ? 'Basic' : 'Bearer'} ${authScheme.value.value}`)
        break
      case 'apiKey':
        headers.set(authScheme.value.name, authScheme.value.value)
        break
      case 'openIdConnect':
        headers.set('Authorization', `Bearer ${authScheme.value.value}`)
        break
      case 'oauth2':
        headers.set('Authorization', `Bearer ${authScheme.value.value}`)
        break
    }
  }

  const newRequest = {
    url: url.toString(),
    headers: Object.fromEntries(headers),
    body: body.value,
  }

  emits('update:request', newRequest)

  return newRequest
}

function setAuthScheme(scheme: SecurityScheme) {
  const name = selectedSchemeName.value

  authScheme.value = {
    type: scheme.type,
    scheme: scheme.scheme,
    name,
    value: useStorage(`--oa-authorization-${name}`, usePlayground().getSecuritySchemeDefaultValue(scheme), localStorage),
  }
}

watch([variables, authScheme, body], buildRequest, { deep: true, immediate: true })

watch(selectedScheme, () => {
  if (!selectedScheme.value) {
    return
  }

  setAuthScheme(selectedScheme.value)
}, { immediate: true })
</script>

<template>
  <div class="flex flex-col">
    <details
      v-if="authScheme"
      open
      class="flex flex-col"
    >
      <summary class="my-0! text-lg font-bold cursor-pointer">
        {{ $t('Authorization') }}
      </summary>

      <div class="flex flex-col">
        <div class="flex flex-row items-center space-x-2">
          <span class="text-sm font-bold">{{ authScheme.name }}</span>
        </div>
        <div class="flex flex-row items-center space-x-2">
          <OARequestSecurityInput
            v-model="authScheme.value"
            :scheme="authScheme"
            class="w-full"
          />
        </div>
      </div>
    </details>

    <details
      v-if="headerParameters.length"
      open
      class="flex flex-col"
    >
      <summary class="my-0! text-lg font-bold cursor-pointer">
        {{ $t('Headers') }}
      </summary>

      <div class="flex flex-col">
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
    </details>

    <details
      v-if="Object.keys(queryParameters).length || Object.keys(pathParameters).length"
      open
      class="flex flex-col"
    >
      <summary class="my-0! text-lg font-bold cursor-pointer">
        {{ $t('Variables') }}
      </summary>

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
    </details>

    <details
      v-if="body"
      open
      class="flex flex-col"
    >
      <summary class="my-0! text-lg font-bold cursor-pointer">
        {{ $t('Body') }}
      </summary>

      <div class="flex flex-col">
        <OAJSONEditor
          v-model="body"
          :is-dark="props.isDark"
          class="w-full"
        />
      </div>
    </details>
  </div>
</template>
