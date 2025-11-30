<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { PlaygroundSecurityScheme, SecurityUi } from '../../types'
import { useStorage } from '@vueuse/core'
import { computed, provide, ref } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { buildRequest } from '../../lib/codeSamples/buildRequest'
import { initOperationData, OPERATION_DATA_KEY } from '../../lib/operationData'
import { resolveBaseUrl } from '../../lib/resolveBaseUrl'
import { isLocalStorageAvailable } from '../../lib/utils'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  openapi: {
    type: Object,
    required: true,
  },
  shouldBuildRequest: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const themeConfig = useTheme()

const operation = computed(() => props.openapi.getOperation(props.operationId))
const path = computed(() => props.openapi.getOperationPath(props.operationId))
const method = computed(() => props.openapi.getOperationMethod(props.operationId))
const parameters = computed(() => props.openapi.getOperationParameters(props.operationId))
const securityUi: ComputedRef<SecurityUi> = computed(() => operation.value?.securityUi)
const requestBody = computed(() => operation.value?.requestBody)
const responses = computed(() => operation.value?.responses)
const codeSamples = computed(() => operation.value?.codeSamples)

const servers = computed(() => {
  const customGetServers = themeConfig.getOperationServers()

  return customGetServers
    ? customGetServers({
        method: method.value,
        path: path.value,
        operation: operation.value,
      })
    : props.openapi.getOperationServers(props.operationId)
})

const defaultServer = computed(
  () => servers.value.length
    ? servers.value[0]?.url
    : themeConfig.getOperationDefaultBaseUrl(),
)

const customServer = isLocalStorageAvailable()
  ? useStorage('--oa-custom-server-url', null, localStorage)
  : ref(defaultServer.value)

const baseUrl = computed(() => {
  if (themeConfig.getServerAllowCustomServer() && customServer.value) {
    return resolveBaseUrl(customServer.value)
  }

  return resolveBaseUrl(defaultServer.value)
})

const defaultRequestContentType = requestBody.value?.content
  ? Object.keys(requestBody.value.content)[0]
  : undefined

const authorizations = securityUi.value?.[0]?.schemes || []

const request = props.shouldBuildRequest
  ? buildRequest({
      path: path.value,
      method: method.value,
      baseUrl: baseUrl.value,
      parameters: parameters.value ?? [],
      authorizations: Object.entries(authorizations).map(([name, value]: [string, any]) => {
        return {
          ...value,
          name: String(name),
          label: String(name),
        } as PlaygroundSecurityScheme
      }),
      body: defaultRequestContentType
        ? (requestBody.value?.content?.[defaultRequestContentType]?.examples ?? [{ value: '' }])[0]?.value
        : undefined,
      variables: {},
      contentType: defaultRequestContentType,
    })
  : undefined

const operationData = initOperationData({
  operation: operation.value,
  request,
  selectedServer: baseUrl.value,
  defaultRequestContentType,
})
provide(OPERATION_DATA_KEY, operationData)
</script>

<template>
  <slot
    :path="path"
    :method="method"
    :parameters="parameters"
    :operation="operation"
    :request-body="requestBody"
    :security-ui="securityUi"
    :servers="servers"
    :code-samples="codeSamples"
    :responses="responses"
    :operation-data="operationData"
  />
</template>
