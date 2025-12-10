<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OAExampleObject } from '../../types'
import { computed, ref, watch } from 'vue'
import { createCompositeKey } from '../../lib/playground/createCompositeKey'
import {
  isFormUrlEncoded,
  isJson,
  isMultipartFormData,
  isXml,
} from '../../lib/utils/contentTypeUtils'
import OAJSONEditor from '../Common/OAJSONEditor.vue'
import { Textarea } from '../ui/textarea'
import OAPlaygroundParameterInput from './OAPlaygroundParameterInput.vue'

interface BodyParameter extends Partial<OpenAPIV3.ParameterObject> {
  name: string
  in: string
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject
  required?: boolean
}

interface Props {
  operationId: string
  body: any
  contentType: string
  requestBody?: OpenAPIV3.RequestBodyObject
  enabledParameters: Record<string, boolean>
  examples?: {
    [key: string]: OAExampleObject
  }
}

const props = defineProps<Props>()

const emits = defineEmits<{
  'update:body': [value: any]
  'update:enabled': [key: string, value: boolean]
  'submit': []
}>()

const bodyValue = computed({
  get: () => props.body,
  set: value => emits('update:body', value),
})

const isJsonContent = computed(() => isJson(props.contentType))
const isFormUrlEncodedContent = computed(() => isFormUrlEncoded(props.contentType))
const isMultipartFormDataContent = computed(() => isMultipartFormData(props.contentType))
const isXmlContent = computed(() => isXml(props.contentType))

const shouldUseTextarea = computed(() => isXmlContent.value)

const shouldUseInput = computed(() => !props.requestBody?.content?.[props.contentType]?.schema?.properties)

const bodyParameters = computed<BodyParameter[]>(() => {
  if (shouldUseInput.value) {
    return [
      {
        name: 'body',
        in: 'body',
        schema: props.requestBody?.content?.[props.contentType]?.schema,
        example: props.examples ? Object.values(props.examples)[0]?.value : null,
      } as BodyParameter,
    ]
  }

  return Object.keys(props.requestBody?.content?.[props.contentType]?.schema?.properties ?? {}).map(key => ({
    name: key,
    in: 'body',
    required: props.requestBody?.content?.[props.contentType]?.schema?.required?.includes(key),
    schema: props.requestBody?.content?.[props.contentType]?.schema?.properties?.[key],
  }))
})

const getParameterValue = computed(() => (parameter: BodyParameter) => {
  if (isFormUrlEncodedContent.value || isMultipartFormDataContent.value) {
    return (paramValues.value as Record<string, string | File>)[parameter.name] || ''
  }
  return bodyValue.value
})

const paramValues = ref<Record<string, string | File>>({})

const getEnabledParams = computed(() => {
  return Object.keys(paramValues.value).filter((key) => {
    const param = bodyParameters.value.find(p => p.name === key)
    return param && (
      props.enabledParameters[createCompositeKey({
        parameter: param as OpenAPIV3.ParameterObject,
        operationId: props.operationId,
      })] ?? props.enabledParameters.body
    )
  })
})

const parametersWithKeys = computed(() =>
  bodyParameters.value.map((parameter) => {
    const compositeKey = createCompositeKey({
      parameter: parameter as OpenAPIV3.ParameterObject,
      operationId: props.operationId,
    })
    return {
      parameter,
      compositeKey,
      enabled: props.enabledParameters[compositeKey] ?? props.enabledParameters.body,
    }
  }))

function createFormData(enabledParams: string[]): Record<string, string> | FormData {
  if (isFormUrlEncodedContent.value) {
    return Object.fromEntries(
      enabledParams.map(key => [key, paramValues.value[key] as string]),
    )
  } else if (isMultipartFormDataContent.value) {
    const formData = new FormData()
    enabledParams.forEach((key) => {
      const v = paramValues.value[key]
      if (v instanceof File) {
        formData.append(key, v, v.name)
      } else {
        formData.append(key, v || '')
      }
    })
    return formData
  }

  return {}
}

function updateParameterValue(parameter: BodyParameter, value: any): void {
  paramValues.value[parameter.name] = value

  if (isFormUrlEncodedContent.value || isMultipartFormDataContent.value) {
    const enabledParams = getEnabledParams.value
    bodyValue.value = createFormData(enabledParams)
  } else {
    // For other content types, pass the value directly.
    bodyValue.value = value
  }
}

function updateParameterEnabled(parameter: BodyParameter, enabled: boolean): void {
  emits('update:enabled', createCompositeKey({
    parameter: parameter as OpenAPIV3.ParameterObject,
    operationId: props.operationId,
  }), enabled)

  if (isFormUrlEncodedContent.value || isMultipartFormDataContent.value) {
    const enabledParams = getEnabledParams.value
    bodyValue.value = createFormData(enabledParams)
  }
}

// Watch for changes in body value to update parameter values.
watch(() => props.body, (newBody: any) => {
  if (isFormUrlEncodedContent.value && typeof newBody === 'string') {
    const params = new URLSearchParams(newBody)
    const newParamValues: Record<string, string> = {}

    params.forEach((value, key) => {
      newParamValues[key] = value
    })

    paramValues.value = newParamValues
  } else if (isMultipartFormDataContent.value && newBody instanceof FormData) {
    const newParamValues: Record<string, string> = {}

    newBody.forEach((value, key) => {
      newParamValues[key] = value as string
    })

    paramValues.value = newParamValues
  }
}, { immediate: true })

// Watch for changes in content type to update body value.
watch(() => props.contentType, () => {
  bodyValue.value = Object.values(props.examples ?? {})[0]?.value
}, { immediate: true })
</script>

<template>
  <div>
    <div v-if="isJsonContent" class="bg-muted p-1 rounded">
      <div v-if="bodyValue !== null" class="!m-0 vp-adaptive-theme min-h-16 language-json">
        <button
          title="Copy Code"
          class="copy"
        />
        <span class="lang">JSON</span>

        <OAJSONEditor v-model="bodyValue" class="w-full" />
      </div>
    </div>

    <Textarea
      v-else-if="shouldUseTextarea && bodyValue !== null && typeof bodyValue === 'string'"
      :id="`body-textarea-${props.operationId}`"
      :model-value="bodyValue"
      :name="`body-textarea-${props.operationId}`"
      :disabled="!props.enabledParameters.body"
      :rows="isXmlContent ? 7 : 1"
      :autocorrect="false"
      :autocomplete="false"
      :autocapitalize="false"
      :spellcheck="false"
      class="bg-muted"
      @input="bodyValue = $event.target.value"
    />

    <div v-else class="flex flex-col gap-1">
      <OAPlaygroundParameterInput
        v-for="item in parametersWithKeys"
        :key="item.compositeKey"
        :model-value="getParameterValue(item.parameter)"
        :parameter="item.parameter"
        :composite-key="item.compositeKey"
        :enabled="item.enabled"
        :hide-label="parametersWithKeys.length === 1"
        @update:model-value="updateParameterValue(item.parameter, $event)"
        @update:enabled="updateParameterEnabled(item.parameter, $event)"
        @submit="emits('submit')"
      />
    </div>
  </div>
</template>
