<script setup>
import { useStorage } from '@vueuse/core'
import { computed, defineProps, provide, ref } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { buildRequest } from '../../lib/codeSamples/buildRequest'
import { initOperationData, OPERATION_DATA_KEY } from '../../lib/operationData'
import { resolveBaseUrl } from '../../lib/resolveBaseUrl'

const props = defineProps({
  id: {
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
  operation: {
    type: Object,
    required: true,
  },
  servers: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const themeConfig = useTheme()

const operationData = initOperationData({
  operation: props.operation,
})

provide(OPERATION_DATA_KEY, operationData)

const operationPath = props.path

const operationMethod = props.method.toUpperCase()

const securityUi = props.operation.securityUi

const operationParameters = props.operation?.parameters

const operationRequestBody = props.operation?.requestBody

const operationResponses = props.operation?.responses

const operationSlots = computed(() => themeConfig.getOperationSlots().filter(slot => !themeConfig.getOperationHiddenSlots().includes(slot)))

const operationCols = computed(() => themeConfig.getOperationCols())

const customGetServers = themeConfig.getOperationServers()

const servers = customGetServers
  ? customGetServers({
      method: operationMethod,
      path: operationPath,
      operation: props.operation,
    })
  : props.servers

const defaultServer = servers.length ? servers[0]?.url : themeConfig.getOperationDefaultBaseUrl()

const selectedServer = typeof localStorage !== 'undefined'
  ? useStorage(`--oa-operation-${props.id}-selectedServer`, defaultServer, localStorage, {
      mergeDefaults: true,
    })
  : ref(defaultServer)

const customServer = typeof localStorage !== 'undefined'
  ? useStorage('--oa-custom-server-url', null, localStorage)
  : ref(selectedServer.value)

const baseUrl = computed(() => {
  if (themeConfig.getServerAllowCustomServer() && customServer.value) {
    return resolveBaseUrl(customServer.value)
  }

  let value = selectedServer.value

  if (servers.length && !servers.some(server => server.url === value)) {
    value = servers[0]?.url

    updateSelectedServer(value)
  }

  return resolveBaseUrl(value)
})

const shouldBuildRequest = computed(() => ['playground', 'try-it', 'code-samples'].some(slot => operationSlots.value.includes(slot)))

const request = ref(
  shouldBuildRequest.value
    ? buildRequest({
        path: operationPath,
        method: operationMethod,
        baseUrl: baseUrl.value,
        parameters: operationParameters ?? [],
        authorizations: securityUi.length ? Object.entries(securityUi)[0]?.schemes : {},
        body: (operationRequestBody?.content?.[operationData.request.selectedContentType.value]?.examples ?? { value: '' })[0]?.value,
        variables: {},
        contentType: operationData.request.selectedContentType.value,
      })
    : {},
)

const codeSamples = props.operation.codeSamples

function updateRequest(newRequest) {
  request.value = newRequest
}

function updateSelectedServer(server) {
  selectedServer.value = server
}
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
        class="relative grid grid-cols-1"
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
            class="OAPathContentEnd sticky top-[100px] inset-x-0 flex flex-col"
            :class="{
              '!px-0': operationCols === 1,
            }"
          >
            <div
              v-if="operationSlots.includes('path') && operationCols === 2"
              :class="{
                'hidden sm:block sm:mb-2': operationCols === 2,
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

            <div v-if="operationSlots.includes('try-it') || operationSlots.includes('playground')">
              <slot
                name="playground"
                :operation-id="props.id"
                :path="operationPath"
                :method="operationMethod"
                :base-url="baseUrl"
                :parameters="operationParameters"
                :request-body="operationRequestBody"
                :security-ui="securityUi"
                :request="request"
                :update-request="updateRequest"
                :servers="servers"
                :update-selected-server="updateSelectedServer"
              />
            </div>

            <div v-if="operationSlots.includes('code-samples')">
              <slot
                name="code-samples"
                :operation-id="props.id"
                :operation="operation"
                :method="operationMethod"
                :base-url="baseUrl"
                :path="operationPath"
                :request="request"
                :update-request="updateRequest"
                :code-samples="codeSamples"
              />
            </div>
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
