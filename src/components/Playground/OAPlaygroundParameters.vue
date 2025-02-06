<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OperationData } from '../../lib/operationData'
import type { PlaygroundSecurityScheme, SecurityUiItem } from '../../types'
import { useStorage } from '@vueuse/core'
import { defineEmits, defineProps, inject, ref, watch } from 'vue'
import { usePlayground } from '../../composables/usePlayground'
import { buildRequest } from '../../lib/codeSamples/buildRequest'
import { OARequest } from '../../lib/codeSamples/request'
import { getPropertyExample } from '../../lib/examples/getPropertyExample'
import { OPERATION_DATA_KEY } from '../../lib/operationData'
import OAJSONEditor from '../Common/OAJSONEditor.vue'
import OAPlaygroundParameterInput from '../Playground/OAPlaygroundParameterInput.vue'
import OAPlaygroundSecurityInput from '../Playground/OAPlaygroundSecurityInput.vue'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

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
  securityUi: {
    type: Object,
    required: true,
  },
  examples: {
    type: Object,
    required: false,
  },
})

const emits = defineEmits([
  'update:request',
])

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

      acc[parameter.name] = getPropertyExample(parameter) ?? ''
      return acc
    }, {})
}

const operationData = inject(OPERATION_DATA_KEY) as OperationData

const authorizations = ref<PlaygroundSecurityScheme[] | null>(null)

const body = ref(Object.keys(props.examples ?? {}).length ? Object.values(props.examples ?? {})[0].value : null)

function setAuthorizations(schemes: Record<string, PlaygroundSecurityScheme>) {
  if (!schemes || !Object.keys(schemes).length) {
    authorizations.value = null
    return
  }

  authorizations.value = Object.keys(schemes).map((name) => {
    const scheme = schemes[name] as PlaygroundSecurityScheme
    return {
      type: scheme.type,
      scheme: scheme.scheme,
      name: scheme.name ?? name,
      playgroundValue: typeof localStorage !== 'undefined'
        ? useStorage(`--oa-authorization-${name}`, usePlayground().getSecuritySchemeDefaultValue(scheme), localStorage)
        : usePlayground().getSecuritySchemeDefaultValue(scheme),
      label: name,
    }
  })
}

watch([variables, authorizations, body, () => props.baseUrl], () => {
  emits('update:request', buildRequest({
    baseUrl: props.baseUrl,
    method: props.method as OpenAPIV3.HttpMethods,
    path: props.path,
    variables: variables.value,
    authorizations: authorizations.value,
    body: body.value,
    parameters: props.parameters,
  }))
}, { deep: true })

watch(operationData.security.selectedSchemeId, () => {
  setAuthorizations(
    props.securityUi?.find((scheme: SecurityUiItem) => scheme.id === operationData.security.selectedSchemeId.value)?.schemes
    ?? props.securityUi?.[0]?.schemes
    ?? {},
  )
}, { immediate: true })
</script>

<template>
  <div class="OAPlaygroundParameters">
    <details v-if="authorizations" open>
      <summary>
        {{ $t('Authorization') }}
        <div v-if="props.securityUi.length > 1" class="w-full max-w-[33%] md:max-w-[50%] ml-auto -mt-8">
          <Select
            :model-value="operationData.security.selectedSchemeId.value"
            @update:model-value="operationData.security.selectedSchemeId.value = $event"
          >
            <SelectTrigger
              aria-label="Security Scheme"
              class="h-9 px-3 py-1.5 text-foreground font-normal"
            >
              <SelectValue :placeholder="operationData.security.selectedSchemeId.value ?? $t('Select...')" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="item in props.securityUi"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.id }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </summary>

      <div class="flex flex-col gap-2">
        <div
          v-for="authorization in authorizations"
          :key="authorization.name"
          class="flex flex-col"
        >
          <div class="flex flex-row items-center space-x-2">
            <span class="text-sm font-bold">{{ authorization.label }}</span>
          </div>
          <div class="flex flex-row items-center space-x-2">
            <OAPlaygroundSecurityInput
              v-model="authorization.playgroundValue"
              :scheme="authorization"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </details>

    <details v-if="headerParameters.length" open>
      <summary>
        {{ $t('Headers') }}
      </summary>

      <div class="flex flex-col gap-2">
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

    <details v-if="Object.keys(queryParameters).length || Object.keys(pathParameters).length" open>
      <summary>
        {{ $t('Variables') }}
      </summary>

      <div class="flex flex-col gap-1">
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

    <details v-if="body" open>
      <summary>
        {{ $t('Body') }}
      </summary>

      <OAJSONEditor v-model="body" class="w-full" />
    </details>
  </div>
</template>

<style scoped>
.OAPlaygroundParameters {
  @apply flex flex-col gap-2;
}
.OAPlaygroundParameters > details {
  @apply flex flex-col gap-2;
}
.OAPlaygroundParameters > details > summary {
  @apply !my-0 text-lg font-bold cursor-pointer;
}
</style>
