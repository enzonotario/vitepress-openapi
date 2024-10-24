<script setup>
import { defineProps } from 'vue'
import { useTheme } from 'vitepress-openapi/composables/useTheme'
import { getOpenApiInstance } from 'vitepress-openapi'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  openapi: {
    type: Object,
    required: false,
  },
})

const themeConfig = useTheme()

const openapi = props.openapi ?? getOpenApiInstance()

const operation = openapi.getOperation(props.id)

const operationPath = openapi.getOperationPath(props.id)

const operationMethod = openapi.getOperationMethod(props.id)?.toUpperCase()

const baseUrl = openapi.getBaseUrl(props.id)

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
      class="OAPath flex flex-col space-y-8"
    >
      <slot
        name="header"
        :operation="operation"
        :method="operationMethod"
        :base-url="baseUrl"
        :path="operationPath"
        :deprecated="operation.deprecated"
      />

      <div class="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="OAPathContentStart flex flex-col">
          <div class="flex flex-col">
            <slot
              name="path-mobile"
              :operation-id="props.id"
              :operation="operation"
              :method="operationMethod"
              :base-url="baseUrl"
              :path="operationPath"
              :hide-base-url="!themeConfig.getShowBaseURL()"
              :deprecated="operation.deprecated"
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
          <div class="OAPathContentEnd sticky top-[100px] inset-x-0 flex flex-col space-y-4">
            <slot
              name="path"
              :operation-id="props.id"
              :operation="operation"
              :method="operationMethod"
              :base-url="baseUrl"
              :path="operationPath"
              :hide-base-url="!themeConfig.getShowBaseURL()"
              :deprecated="operation.deprecated"
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
