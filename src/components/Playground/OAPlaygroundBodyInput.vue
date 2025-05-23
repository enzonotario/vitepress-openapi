<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { isFormUrlEncoded as _isFormUrlEncoded, isJson as _isJson, isMultipartFormData as _isMultipartFormData } from '../../lib/contentTypeUtils'
import { createCompositeKey } from '../../lib/playground/createCompositeKey'
import OAJSONEditor from '../Common/OAJSONEditor.vue'
import OAPlaygroundParameterInput from './OAPlaygroundParameterInput.vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  body: {
    type: [Object, String, null],
    default: null,
  },
  contentType: {
    type: String,
    required: true,
  },
  requestBody: {
    type: Object,
    required: false,
  },
  enabledParameters: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits([
  'update:body',
  'update:enabled',
  'submit',
])

const bodyValue = computed({
  get: () => props.body,
  set: value => emits('update:body', value),
})

const isJson = computed(() => _isJson(props.contentType))

const isFormUrlEncoded = computed(() => _isFormUrlEncoded(props.contentType))

const isMultipartFormData = computed(() => _isMultipartFormData(props.contentType))

const bodyParameters = computed(() => {
  if (!props.requestBody?.content?.[props.contentType]?.schema?.properties) {
    return [{ name: 'body', in: 'body', schema: { type: 'string' } }]
  }

  return Object.keys(props.requestBody.content[props.contentType].schema.properties).map(key => ({
    name: key,
    in: 'body',
    required: props.requestBody?.content[props.contentType].schema.required?.includes(key),
    schema: props.requestBody?.content[props.contentType].schema.properties[key],
  }))
})

const paramValues = ref<Record<string, string>>({})

function updateParameterValue(parameter: any, value: string) {
  paramValues.value[parameter.name] = value

  if (isFormUrlEncoded.value || isMultipartFormData.value) {
    const enabledParams = Object.keys(paramValues.value).filter((key) => {
      const param = bodyParameters.value.find(p => p.name === key)
      return param && (props.enabledParameters[createCompositeKey({ parameter: param, operationId: props.operationId })] ?? props.enabledParameters.body)
    })

    if (isFormUrlEncoded.value) {
      bodyValue.value = Object.fromEntries(
        enabledParams.map((key) => {
          return [key, paramValues.value[key]]
        }),
      )
    } else if (isMultipartFormData.value) {
      const formData = new FormData()

      enabledParams.forEach((key) => {
        formData.append(key, paramValues.value[key] || '')
      })

      bodyValue.value = formData
    }
  } else {
    // For other content types, pass the value directly.
    bodyValue.value = value
  }
}

function updateParameterEnabled(parameter: any, enabled: boolean) {
  emits('update:enabled', createCompositeKey({ parameter, operationId: props.operationId }), enabled)

  if (isFormUrlEncoded.value || isMultipartFormData.value) {
    // Recalculate the form data when a parameter is enabled/disabled.
    const enabledParams = Object.keys(paramValues.value).filter((key) => {
      const param = bodyParameters.value.find(p => p.name === key)
      return param && (props.enabledParameters[createCompositeKey({ parameter: param, operationId: props.operationId })] ?? props.enabledParameters.body)
    })

    if (isFormUrlEncoded.value) {
      bodyValue.value = Object.fromEntries(
        enabledParams.map((key) => {
          return [key, paramValues.value[key]]
        }),
      )
    } else if (isMultipartFormData.value) {
      const formData = new FormData()

      enabledParams.forEach((key) => {
        formData.append(key, paramValues.value[key] || '')
      })

      bodyValue.value = formData
    }
  }
}

watch(() => props.body, (newBody: any) => {
  if (isFormUrlEncoded.value && typeof newBody === 'string') {
    const params = new URLSearchParams(newBody)
    const newParamValues: Record<string, string> = {}

    params.forEach((value, key) => {
      newParamValues[key] = value
    })

    paramValues.value = newParamValues
  } else if (isMultipartFormData.value && newBody instanceof FormData) {
    const newParamValues: Record<string, string> = {}

    newBody.forEach((value, key) => {
      newParamValues[key] = value as string
    })

    paramValues.value = newParamValues
  }
}, { immediate: true })
</script>

<template>
  <div>
    <div v-if="isJson" class="bg-muted p-1 rounded">
      <div class="!m-0 vp-adaptive-theme min-h-16 language-json">
        <button
          title="Copy Code"
          class="copy"
        />
        <span class="lang">JSON</span>

        <OAJSONEditor v-model="bodyValue" class="w-full" />
      </div>
    </div>

    <div v-else class="flex flex-col gap-1">
      <OAPlaygroundParameterInput
        v-for="parameter in bodyParameters"
        :key="createCompositeKey({ parameter, operationId: props.operationId })"
        :model-value="isFormUrlEncoded || isMultipartFormData ? paramValues[parameter.name] || '' : String(bodyValue)"
        :parameter="parameter"
        :composite-key="createCompositeKey({ parameter, operationId: props.operationId })"
        :enabled="props.enabledParameters[createCompositeKey({ parameter, operationId: props.operationId })] ?? props.enabledParameters.body"
        @update:model-value="updateParameterValue(parameter, $event)"
        @update:enabled="updateParameterEnabled(parameter, $event)"
        @submit="emits('submit')"
      />
    </div>
  </div>
</template>
