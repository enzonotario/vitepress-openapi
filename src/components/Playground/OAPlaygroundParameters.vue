<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { ComputedRef } from 'vue'
import type { OperationData } from '../../lib/operationData'
import type { PlaygroundSecurityScheme, SecurityUiItem } from '../../types'
import { useI18n } from '@byjohann/vue-i18n'
import { useStorage } from '@vueuse/core'
import { computed, defineEmits, defineProps, inject, ref, watch } from 'vue'
import { usePlayground } from '../../composables/usePlayground'
import { useTheme } from '../../composables/useTheme'
import { buildRequest } from '../../lib/codeSamples/buildRequest'
import { getPropertyExample } from '../../lib/examples/getPropertyExample'
import { OPERATION_DATA_KEY } from '../../lib/operationData'
import { createCompositeKey } from '../../lib/playground/createCompositeKey'
import OAPlaygroundBodyInput from '../Playground/OAPlaygroundBodyInput.vue'
import OAPlaygroundParameterInput from '../Playground/OAPlaygroundParameterInput.vue'
import OAPlaygroundSecurityInput from '../Playground/OAPlaygroundSecurityInput.vue'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import SelectWithCustomOption from '../ui/select-with-custom-option/SelectWithCustomOption.vue'

const props = defineProps({
  operationId: {
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
  servers: {
    type: Array,
    default: () => [],
  },
  parameters: {
    type: Array<OpenAPIV3.ParameterObject>,
    required: false,
    default: () => [],
  },
  securityUi: {
    type: Object,
    required: false,
    default: () => ([] as SecurityUiItem[]),
  },
  examples: {
    type: Object,
    required: false,
  },
  requestBody: {
    type: Object,
    required: false,
  },
})

const emits = defineEmits([
  'submit',
])

const operationData = inject(OPERATION_DATA_KEY) as OperationData
const { t } = useI18n()

const selectedServer = computed({
  get: () => operationData.playground.selectedServer.value,
  set: (value) => {
    operationData.playground.selectedServer.value = value
  },
})

const selectedSchemeId = computed({
  get: () => operationData.security.selectedSchemeId.value,
  set: (value) => {
    operationData.security.selectedSchemeId.value = value
  },
})

const selectedContentType = computed({
  get: () => operationData.requestBody.selectedContentType.value,
  set: (value) => {
    operationData.requestBody.selectedContentType.value = value
  },
})

const request = computed({
  get: () => operationData.playground.request.value,
  set: (value) => {
    operationData.playground.request.value = value
  },
})

const allowCustomServer = computed(() => useTheme().getServerAllowCustomServer())

const useCustomServer = typeof localStorage !== 'undefined'
  ? useStorage('--oa-use-custom-server', allowCustomServer.value, localStorage)
  : ref(false)

const headerParameters = props.parameters.filter(parameter => parameter && parameter.in === 'header')

const pathParameters = props.parameters.filter(parameter => parameter && parameter.in === 'path')

const queryParameters = props.parameters.filter(parameter => parameter && parameter.in === 'query')

const servers = computed(() => props.servers as OpenAPIV3.ServerObject[])

const serversUrls: ComputedRef<string[]> = computed(() =>
  servers
    .value
    .map(server => server.url)
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates.
    .filter(value => value !== undefined),
)

const customServer = typeof localStorage !== 'undefined'
  ? useStorage('--oa-custom-server-url', selectedServer.value, localStorage)
  : ref(selectedServer.value)

const variables = ref({
  ...initializeVariables(headerParameters),
  ...initializeVariables(pathParameters),
  ...initializeVariables(queryParameters),
})

const enabledParameters = ref(
  [...headerParameters, ...pathParameters, ...queryParameters].reduce((acc, parameter) => {
    if (parameter.name) {
      const key = createCompositeKey({ parameter, operationId: props.operationId })
      acc[key] = parameter.required === true
    }
    return acc
  }, { body: true } as Record<string, boolean>),
)

function initializeVariables(parameters: OpenAPIV3.ParameterObject[]) {
  return parameters
    .reduce((acc: Record<string, string>, parameter: OpenAPIV3.ParameterObject) => {
      if (!parameter.name) {
        return acc
      }

      acc[parameter.name] = getPropertyExample(parameter) ?? ''
      return acc
    }, {})
}

const authorizations = ref<PlaygroundSecurityScheme[]>([])

const body = ref(null)

watch([variables, authorizations, body, selectedServer, enabledParameters], () => {
  const filteredParameters = props.parameters.filter(parameter =>
    parameter.name && enabledParameters.value[createCompositeKey({ parameter, operationId: props.operationId })],
  )

  request.value = buildRequest({
    baseUrl: selectedServer.value,
    method: props.method as OpenAPIV3.HttpMethods,
    path: props.path,
    variables: variables.value,
    authorizations: authorizations.value,
    body: enabledParameters.value.body ? body.value : undefined,
    parameters: filteredParameters,
    contentType: selectedContentType.value,
    headers: {
      ...(useTheme().getCodeSamplesDefaultHeaders() || {}),
    },
  })
}, { deep: true })

watch(selectedSchemeId, (schemeId) => {
  const selectedScheme = props.securityUi.find((scheme: SecurityUiItem) => scheme.id === schemeId)

  const schemes = selectedScheme?.schemes || props.securityUi?.[0]?.schemes || {}

  if (!schemes || !Object.keys(schemes).length) {
    authorizations.value = []
    return
  }

  authorizations.value = Object.keys(schemes).map((name) => {
    const scheme = schemes[name] as PlaygroundSecurityScheme
    const example = getPropertyExample(scheme) ?? usePlayground().getSecuritySchemeDefaultValue(scheme)
    return {
      type: scheme.type,
      scheme: scheme.scheme,
      name: scheme.name ?? name,
      value: typeof localStorage !== 'undefined'
        ? useStorage(`--oa-authorization-${name}`, example, localStorage)
        : example,
      label: name,
      example,
    }
  })
}, { immediate: true })
</script>

<template>
  <div class="OAPlaygroundParameters">
    <details v-if="serversUrls.length > 1 || allowCustomServer" open>
      <summary>
        {{ t('Server') }}
      </summary>

      <div class="flex flex-col gap-2">
        <SelectWithCustomOption
          v-model="selectedServer"
          v-model:custom-value="customServer"
          v-model:is-custom="useCustomServer"
          :default-custom-value="customServer"
          :options="serversUrls"
          :allow-custom-option="allowCustomServer"
          :custom-option-label="t('Custom Server')"
          :custom-placeholder="t('Enter a custom server URL')"
          :placeholder="t('Select a server')"
          @submit="emits('submit')"
        />
      </div>
    </details>

    <details v-if="authorizations?.length" open>
      <summary>
        {{ t('Authorization') }}
        <div v-if="props.securityUi.length > 1" class="w-full max-w-[33%] md:max-w-[50%] ml-auto -mt-8">
          <Select v-model="selectedSchemeId">
            <SelectTrigger
              aria-label="Security Scheme"
              class="h-9 px-3 py-1.5 text-foreground font-normal"
            >
              <SelectValue :placeholder="selectedSchemeId ?? t('Select')" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="item in props.securityUi"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.id }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </summary>

      <div class="flex flex-col gap-2">
        <div
          v-for="authorization in authorizations"
          :key="authorization.name"
          class="flex flex-col"
        >
          <div class="flex flex-row items-center space-x-2">
            <Label :for="authorization.name" class="text-sm font-bold">{{ authorization.label }}</Label>
          </div>
          <div class="flex flex-row items-center space-x-2">
            <OAPlaygroundSecurityInput
              v-model="authorization.value"
              :scheme="authorization"
              :name="authorization.name"
              class="w-full"
              @submit="emits('submit')"
            />
          </div>
        </div>
      </div>
    </details>

    <details v-if="headerParameters.length" open>
      <summary>
        {{ t('Headers') }}
      </summary>

      <div class="flex flex-col gap-2">
        <div
          v-for="parameter in headerParameters"
          :key="createCompositeKey({ parameter, operationId: props.operationId })"
          class="flex flex-col gap-2"
        >
          <OAPlaygroundParameterInput
            v-model="variables[parameter.name ?? '']"
            :parameter="parameter"
            :composite-key="createCompositeKey({ parameter, operationId: props.operationId })"
            :enabled="enabledParameters[createCompositeKey({ parameter, operationId: props.operationId })]"
            @update:enabled="enabledParameters[createCompositeKey({ parameter, operationId: props.operationId })] = $event"
            @submit="emits('submit')"
          />
        </div>
      </div>
    </details>

    <details v-if="Object.keys(queryParameters).length || Object.keys(pathParameters).length" open>
      <summary>
        {{ t('Variables') }}
      </summary>

      <div class="flex flex-col gap-1">
        <div class="flex flex-row gap-2">
          <div class="w-[16px]" />
          <div class="flex flex-row flex-grow gap-2">
            <div class="w-1/2 flex justify-start">
              <span class="text-xs text-muted-foreground uppercase">{{ t('Key') }}</span>
            </div>
            <div class="w-1/2 flex justify-start">
              <span class="text-xs text-muted-foreground uppercase">{{ t('Value') }}</span>
            </div>
          </div>
        </div>

        <OAPlaygroundParameterInput
          v-for="parameter in [...pathParameters, ...queryParameters]"
          :key="createCompositeKey({ parameter, operationId: props.operationId })"
          v-model="variables[parameter.name ?? '']"
          :parameter="parameter"
          :composite-key="createCompositeKey({ parameter, operationId: props.operationId })"
          :enabled="enabledParameters[createCompositeKey({ parameter, operationId: props.operationId })]"
          @update:enabled="enabledParameters[createCompositeKey({ parameter, operationId: props.operationId })] = $event"
          @submit="emits('submit')"
        />
      </div>
    </details>

    <details v-if="props.requestBody && selectedContentType" open>
      <summary>
        {{ t('Body') }}
      </summary>

      <OAPlaygroundBodyInput
        :operation-id="props.operationId"
        :body="body"
        :content-type="selectedContentType"
        :request-body="props.requestBody"
        :enabled-parameters="enabledParameters"
        :examples="props.examples"
        @update:body="body = $event"
        @update:enabled="(key, value) => enabledParameters[key] = value"
        @submit="emits('submit')"
      />
    </details>
  </div>
</template>

<style scoped>
.OAPlaygroundParameters {
  @apply flex flex-col gap-2;
}
.OAPlaygroundParameters > details {
  @apply flex flex-col gap-2;
}
.OAPlaygroundParameters > details > summary {
  @apply !my-0 text-lg font-bold cursor-pointer;
}
</style>
