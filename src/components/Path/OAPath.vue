<script setup>
import { computed, defineProps } from 'vue'
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

const operationSlots = computed(() => themeConfig.getOperationSlots().filter(slot => !themeConfig.getOperationHiddenSlots().includes(slot)))

const operationCols = computed(() => themeConfig.getOperationCols())
</script>

<template>
  <div>
    <div
      v-if="operation"
      class="OAPath flex flex-col space-y-8"
    >
      <template v-if="operationSlots.includes('header')">
        <slot
          name="header"
          :operation="operation"
          :method="operationMethod"
          :base-url="baseUrl"
          :path="operationPath"
          :deprecated="operation.deprecated"
        />
      </template>

      <div
        :class="{
          'sm:grid-cols-1': operationCols === 1,
          'sm:grid-cols-2': operationCols === 2,
        }"
        class="relative grid grid-cols-1 gap-4"
      >
        <div class="OAPathContentStart flex flex-col">
          <div class="flex flex-col gap-4">
            <div
              v-if="operationSlots.includes('path')"
              :class="{
                'sm:hidden': operationCols === 2,
              }"
            >
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
            </div>

            <template v-if="operationSlots.includes('description')">
              <slot
                name="description"
                :operation="operation"
                :method="operationMethod"
                :base-url="baseUrl"
                :path="operationPath"
              />
            </template>
          </div>

          <template v-if="operationSlots.includes('security')">
            <slot
              v-if="Object.keys(securitySchemes).length"
              name="security"
              :operation="operation"
              :method="operationMethod"
              :base-url="baseUrl"
              :path="operationPath"
              :security-schemes="securitySchemes"
            />
          </template>

          <template v-if="operationSlots.includes('parameters')">
            <slot
              v-if="operationParameters?.length"
              name="parameters"
              :operation-id="props.id"
              :parameters="operationParameters"
            />
          </template>

          <template v-if="operationSlots.includes('request-body')">
            <slot
              v-if="operationRequestBody"
              name="request-body"
              :operation-id="props.id"
              :schema="operationRequestBody"
            />
          </template>

          <template v-if="operationSlots.includes('responses')">
            <slot
              v-if="operationResponses"
              name="responses"
              :operation-id="props.id"
              :responses="operationResponses"
            />
          </template>
        </div>

        <div class="flex flex-col">
          <div
            class="OAPathContentEnd sticky top-[100px] inset-x-0 flex flex-col space-y-4"
            :class="{
              '!px-0': operationCols === 1,
            }"
          >
            <div
              v-if="operationSlots.includes('path') && operationCols === 2"
              :class="{
                'hidden sm:block': operationCols === 2,
              }"
            >
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
            </div>

            <template v-if="operationSlots.includes('try-it')">
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
            </template>

            <template v-if="operationSlots.includes('code-samples')">
              <slot
                name="code-samples"
                :operation-id="props.id"
                :operation="operation"
                :method="operationMethod"
                :base-url="baseUrl"
                :path="operationPath"
              />
            </template>
          </div>
        </div>
      </div>

      <template v-if="operationSlots.includes('branding')">
        <slot
          name="branding"
          :operation-id="props.id"
          :operation="operation"
          :method="operationMethod"
          :base-url="baseUrl"
          :path="operationPath"
        />
      </template>

      <template v-if="operationSlots.includes('footer')">
        <slot
          name="footer"
          :operation-id="props.id"
          :operation="operation"
          :method="operationMethod"
          :base-url="baseUrl"
          :path="operationPath"
        />
      </template>
    </div>
  </div>
</template>
