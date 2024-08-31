<script setup>
import { computed, defineProps } from 'vue'
import { useOpenapi } from 'vitepress-theme-openapi'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const openapi = useOpenapi()

const operation = openapi.getOperation(props.id)

const operationParsed = computed(() => openapi.getParsedOperation(props.id))

const operationPath = openapi.getOperationPath(props.id)

const operationMethod = openapi.getOperationMethod(props.id)?.toUpperCase()

const baseUrl = openapi.getBaseUrl()

const securitySchemes = openapi.getSecuritySchemes()

const operationParameters = computed(() => {
  if (!operationParsed.value) {
    return operation.parameters
  }

  return operationParsed.value.parameters
})

const operationRequestBody = computed(() => {
  if (!operationParsed.value) {
    return operation.requestBody?.content?.['application/json']?.schema
  }

  return operationParsed.value?.requestBody?.content?.['application/json']?.schema
})

const operationResponses = computed(() => {
  if (!operationParsed.value) {
    return operation.responses
  }

  return operationParsed.value?.responses
})
</script>

<template>
  <div>
    <div
      v-if="operation"
      class="flex flex-col space-y-8"
    >
      <slot
        name="header"
        :operation="operation"
        :method="operationMethod"
        :base-url="baseUrl"
        :path="operationPath"
      />

      <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <div class="flex flex-col space-y-4">
            <slot
              name="description"
              :operation="operation"
              :method="props.method"
              :base-url="baseUrl"
              :path="operationPath"
            />
          </div>

          <slot
            v-if="Object.keys(securitySchemes).length"
            name="security"
            :operation="operation"
            :method="props.method"
            :base-url="baseUrl"
            :path="operationPath"
            :security-schemes="securitySchemes"
          />

          <slot
            v-if="operationParameters?.length"
            name="parameters"
            :operation-id="props.id"
            :parameters="operationParameters"
          />

          <slot
            v-if="operationRequestBody"
            name="request-body"
            :operation-id="props.id"
            :schema="operationRequestBody"
          />

          <slot
            v-if="operationResponses"
            name="responses"
            :operation-id="props.id"
            :responses="operationResponses"
          />
        </div>

        <div class="flex flex-col">
          <slot
            name="end-top"
            :operation-id="props.id"
            :operation="operation"
            :method="props.method"
            :base-url="baseUrl"
            :path="operationPath"
          />

          <div class="sticky top-[100px] inset-x-0 flex flex-col sm:px-6 space-y-4">
            <slot
              name="try-it"
              :operation-id="props.id"
              :path="operationPath"
              :method="props.method"
              :base-url="baseUrl"
            />

            <slot
              name="code-samples"
              :operation-id="props.id"
              :operation="operation"
              :method="props.method"
              :base-url="baseUrl"
              :path="operationPath"
            />
          </div>
        </div>
      </div>

      <slot
        name="footer"
        :operation-id="props.id"
        :operation="operation"
        :method="props.method"
        :base-url="baseUrl"
        :path="operationPath"
      />
    </div>
  </div>
</template>
