<script setup>
import { defineProps } from 'vue'
import { OpenApi, useOpenapi } from 'vitepress-theme-openapi'
import { useTheme } from 'vitepress-theme-openapi/composables/useTheme'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  spec: {
    type: Object,
    required: false,
  },
})

const theme = useTheme()

const openapi = OpenApi({ spec: props.spec || useOpenapi().json })

const operation = openapi.getOperation(props.id)

const operationPath = openapi.getOperationPath(props.id)

const operationMethod = openapi.getOperationMethod(props.id)?.toUpperCase()

const baseUrl = openapi.getBaseUrl()

const securitySchemes = openapi.getSecuritySchemes(props.id)

const operationParsed = openapi.getParsedOperation(props.id)

const operationParameters = operationParsed?.parameters

const operationRequestBody = operationParsed?.requestBody?.content?.['application/json']?.schema

const operationResponses = operationParsed?.responses
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
          <div class="flex flex-col">
            <slot
              name="path-mobile"
              :operation-id="props.id"
              :operation="operation"
              :method="operationMethod"
              :base-url="baseUrl"
              :path="operationPath"
              :hide-base-url="!theme.getShowBaseURL()"
            />

            <slot
              name="description"
              :operation="operation"
              :method="operationMethod"
              :base-url="baseUrl"
              :path="operationPath"
            />
          </div>

          <slot
            v-if="Object.keys(securitySchemes).length"
            name="security"
            :operation="operation"
            :method="operationMethod"
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
            :method="operationMethod"
            :base-url="baseUrl"
            :path="operationPath"
          />

          <div class="sticky top-[100px] inset-x-0 flex flex-col sm:px-6 space-y-4">
            <slot
              name="path"
              :operation-id="props.id"
              :operation="operation"
              :method="operationMethod"
              :base-url="baseUrl"
              :path="operationPath"
              :hide-base-url="!theme.getShowBaseURL()"
            />

            <slot
              name="try-it"
              :operation-id="props.id"
              :path="operationPath"
              :method="operationMethod"
              :base-url="baseUrl"
              :parameters="operationParameters"
              :schema="operationRequestBody"
              :security-schemes="securitySchemes"
            />

            <slot
              name="code-samples"
              :operation-id="props.id"
              :operation="operation"
              :method="operationMethod"
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
        :method="operationMethod"
        :base-url="baseUrl"
        :path="operationPath"
      />
    </div>
  </div>
</template>
