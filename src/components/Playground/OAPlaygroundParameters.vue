<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import type { OpenAPIV3 } from '@scalar/openapi-types'
import { OARequest } from '../../lib/codeSamples/request'
import { usePlayground } from '../../composables/usePlayground'
import { useTheme } from '../../composables/useTheme'
import type { PlaygroundSecurityScheme } from '../../types'
import OAJSONEditor from '../Common/OAJSONEditor.vue'
import OAPlaygroundParameterInput from '../Playground/OAPlaygroundParameterInput.vue'
import OAPlaygroundSecurityInput from '../Playground/OAPlaygroundSecurityInput.vue'
import { getExample } from '../../lib/getExample'
import { buildRequest } from '../../lib/codeSamples/buildRequest'

const props = defineProps({
  request: { // v-model
    type: Object,
    default: () => (new OARequest()),
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
    type: Array<OpenAPIV3.ParameterObject>,
    required: true,
  },
  securitySchemes: {
    type: Object,
    required: true,
  },
  schemaUiContentType: {
    type: Object,
    required: false,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits([
  'update:request',
])

const themeConfig = useTheme()

const headerParameters = props.parameters.filter(parameter => parameter && parameter.in === 'header')

const pathParameters = props.parameters.filter(parameter => parameter && parameter.in === 'path')

const queryParameters = props.parameters.filter(parameter => parameter && parameter.in === 'query')

const variables = ref({
  ...initializeVariables(headerParameters),
  ...initializeVariables(pathParameters),
  ...initializeVariables(queryParameters),
})

function initializeVariables(parameters: OpenAPIV3.ParameterObject[]) {
  return parameters
    .reduce((acc: Record<string, string>, parameter: OpenAPIV3.ParameterObject) => {
      if (!parameter.name) {
        return acc
      }

      acc[parameter.name] = getExample(parameter) ?? ''
      return acc
    }, {})
}

const selectedSchemeName = computed(() => {
  return themeConfig.getSecuritySelectedScheme() ?? ''
})

const selectedScheme = computed(() => {
  const scheme = props.securitySchemes[selectedSchemeName.value]

  if (!scheme) {
    if (!Object.keys(props.securitySchemes).length) {
      return null
    }

    return props.securitySchemes[Object.keys(props.securitySchemes)[0]]
  }

  return scheme
})

const authScheme = ref<PlaygroundSecurityScheme | null>(null)

const body = ref(props.schemaUiContentType)

function setAuthScheme(scheme: PlaygroundSecurityScheme) {
  const name = selectedSchemeName.value ?? ''

  authScheme.value = {
    type: scheme.type,
    scheme: scheme.scheme,
    name,
    playgroundValue: useStorage(`--oa-authorization-${name}`, usePlayground().getSecuritySchemeDefaultValue(scheme), localStorage),
  }
}

watch([variables, authScheme, body], () => {
  emits('update:request', buildRequest({
    baseUrl: props.baseUrl,
    method: props.method as OpenAPIV3.HttpMethods,
    path: props.path,
    variables: variables.value,
    authScheme: authScheme.value,
    body: body.value,
    parameters: props.parameters,
  }))
}, { deep: true })

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
          <OAPlaygroundSecurityInput
            v-model="authScheme.playgroundValue"
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
            <OAPlaygroundParameterInput
              v-model="variables[parameter.name ?? '']"
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
            <OAPlaygroundParameterInput
              v-model="variables[parameter.name ?? '']"
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
