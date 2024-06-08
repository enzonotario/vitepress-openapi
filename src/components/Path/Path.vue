<script setup>
import { useOpenapi } from 'vitepress-theme-openapi/composables/useOpenapi'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
})

const openapi = useOpenapi()

const operation = openapi.getOperation(props.id)

const operationPath = openapi.getOperationPath(props.id)

const operationParameters = openapi.getOperationParameters(props.id)

const baseUrl = openapi.getBaseUrl()

const schemas = openapi.getSchemas()

const response200 = operation.responses['200']

const responseType = response200.content['application/json'].schema.items ? 'array' : 'object'

const schemaTitle = (responseType === 'array' ? response200.content['application/json'].schema.items : response200.content['application/json'].schema)
  .$ref.split('/')
  .pop()

const schema = Object.values(schemas).find(schema => schema.title === schemaTitle)
</script>

<template>
  <div>
    <div v-if="operation" class="flex flex-col space-y-8">
      <slot name="header" :operation="operation" :method="props.method" :base-url="baseUrl" :path="operationPath" />

      <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <div class="flex flex-col space-y-4">
            <slot name="description"
                  :operation="operation"
                  :method="props.method"
                  :base-url="baseUrl"
                  :path="operationPath" />
          </div>

          <slot
              v-if="operationParameters.length"
              name="parameters"
              :operation="operation"
              :method="props.method"
              :base-url="baseUrl"
              :path="operationPath"
              :parameters="operationParameters" />

          <slot name="responses" :schema="schema" :responses="operation.responses" :response-type="responseType" />
        </div>

        <div class="flex flex-col">
          <slot name="end-top"
                :operation-id="props.id"
                :operation="operation"
                :method="props.method"
                :base-url="baseUrl"
                :path="operationPath" />

          <div class="sticky top-[100px] inset-x-0 flex flex-col sm:px-6 space-y-4">
            <slot name="try-it"
                  :operation-id="props.id"
                  :path="operationPath"
                  :method="props.method"
                  :base-url="baseUrl" />
          </div>
        </div>
      </div>

      <slot name="footer"
            :operation-id="props.id"
            :operation="operation"
            :method="props.method"
            :base-url="baseUrl"
            :path="operationPath" />
    </div>
  </div>
</template>
