<script setup>
import { computed, defineProps, provide, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { getOpenApiInstance } from '../../lib/getOpenApiInstance'
import { buildRequest } from '../../lib/codeSamples/buildRequest'
import { useTheme } from '../../composables/useTheme'
import { initOperationData } from '../../lib/operationData.ts'

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

const operationParsed = openapi.getParsedOperation(props.id)

const securityUi = operation.securityUi

const operationParameters = operationParsed?.parameters

const operationRequestBody = operationParsed?.requestBody

const operationResponses = operationParsed?.responses

const operationSlots = computed(() => themeConfig.getOperationSlots().filter(slot => !themeConfig.getOperationHiddenSlots().includes(slot)))

const operationCols = computed(() => themeConfig.getOperationCols())

const bodyRequestContentTypes = computed(() => operationRequestBody ? Object.keys(operationRequestBody.content) : [])

const bodyRequestContentType = computed(() => bodyRequestContentTypes.value.length ? bodyRequestContentTypes.value[0] : undefined)

const customGetServers = themeConfig.getOperationServers()

const servers = customGetServers
  ? customGetServers({
    method: operationMethod,
    path: operationPath,
    operation,
  })
  : openapi.getOperationServers(props.id)

const defaultServer = servers.length ? servers[0]?.url : themeConfig.getOperationDefaultBaseUrl()

const selectedServer = servers?.length > 1
  ? useStorage(`--oa-operation-${props.id}-selectedServer`, defaultServer, localStorage, {
    mergeDefaults: true,
  })
  : ref(defaultServer)

const baseUrl = computed(() => {
  const value = selectedServer.value

  if (servers.length > 1 && !servers.some(server => server.url === value)) {
    updateSelectedServer(servers[0]?.url)

    return servers[0]?.url
  }

  return value
})

const shouldBuildRequest = computed(() => ['try-it', 'code-samples'].some(slot => operationSlots.value.includes(slot)))

const request = ref(
  shouldBuildRequest.value
    ? buildRequest({
      path: operationPath,
      method: operationMethod,
      baseUrl: baseUrl.value,
      parameters: operationParameters ?? [],
      authorizations: securityUi.length ? Object.entries(securityUi)[0]?.schemes : {},
      body: operationRequestBody?.content?.[bodyRequestContentType]?.uiContentType,
      variables: {},
    })
    : {},
)

function updateRequest(newRequest) {
  request.value = newRequest
}

function updateSelectedServer(server) {
  selectedServer.value = server
}

provide('operationData', initOperationData(operation))
</script>

<template>
  <div>
    <div
      v-if="operation"
      class="OAPath flex flex-col space-y-4"
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

      <template v-if="operationSlots.includes('tags')">
        <slot
          name="tags"
          :operation="operation"
          :method="operationMethod"
          :base-url="baseUrl"
          :path="operationPath"
          :tags="operation.tags"
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
                :servers="servers"
                :update-selected-server="updateSelectedServer"
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
              v-if="Object.keys(securityUi).length"
              name="security"
              :operation="operation"
              :method="operationMethod"
              :base-url="baseUrl"
              :path="operationPath"
              :security-ui="securityUi"
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
              :request-body="operationRequestBody"
              :content-type="bodyRequestContentType"
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
                :servers="servers"
                :update-selected-server="updateSelectedServer"
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
                :request-body="operationRequestBody"
                :security-ui="securityUi"
                :content-type="bodyRequestContentType"
                :request="request"
                :update-request="updateRequest"
                :servers="servers"
                :update-selected-server="updateSelectedServer"
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
                :request="request"
                :update-request="updateRequest"
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
