<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { ComputedRef } from 'vue'
import type { OperationData } from '../../lib/operationData'
import type { PlaygroundSecurityScheme, SecurityUiItem } from '../../types'
import { useStorage } from '@vueuse/core'
import { computed, defineEmits, defineProps, inject, ref, watch } from 'vue'
import { usePlayground } from '../../composables/usePlayground'
import { useTheme } from '../../composables/useTheme'
import { buildRequest } from '../../lib/codeSamples/buildRequest'
import { getPropertyExample } from '../../lib/examples/getPropertyExample'
import { OPERATION_DATA_KEY } from '../../lib/operationData'
import OAJSONEditor from '../Common/OAJSONEditor.vue'
import OAPlaygroundParameterInput from '../Playground/OAPlaygroundParameterInput.vue'
import OAPlaygroundSecurityInput from '../Playground/OAPlaygroundSecurityInput.vue'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import SelectWithCustomOption from '../ui/select-with-custom-option/SelectWithCustomOption.vue'

const props = defineProps({
  request: { // v-model
    type: Object,
  },
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
  baseUrl: {
    type: String,
    required: true,
  },
  servers: {
    type: Array,
    default: () => [],
  },
  parameters: {
    type: Array<OpenAPIV3.ParameterObject>,
    required: true,
  },
  securityUi: {
    type: Object,
    required: true,
  },
  examples: {
    type: Object,
    required: false,
  },
})

const emits = defineEmits([
  'update:request',
  'update:selectedServer',
  'submit',
])

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

const selectedServer = computed({
  get: () => props.baseUrl ?? servers.value[0]?.url,
  set: value => emits('update:selectedServer', value),
})

const customServer = typeof localStorage !== 'undefined'
  ? useStorage('--oa-custom-server-url', selectedServer.value, localStorage)
  : ref(selectedServer.value)

const variables = ref({
  ...initializeVariables(headerParameters),
  ...initializeVariables(pathParameters),
  ...initializeVariables(queryParameters),
})

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

const operationData = inject(OPERATION_DATA_KEY) as OperationData

const authorizations = ref<PlaygroundSecurityScheme[]>([])

const body = ref(Object.keys(props.examples ?? {}).length ? Object.values(props.examples ?? {})[0].value : null)

const bodyType = computed(() => typeof body.value === 'object' ? 'json' : 'text')

function setAuthorizations(schemes: Record<string, PlaygroundSecurityScheme>) {
  if (!schemes || !Object.keys(schemes).length) {
    authorizations.value = []
    return
  }

  authorizations.value = Object.keys(schemes).map((name) => {
    const scheme = schemes[name] as PlaygroundSecurityScheme
    return {
      type: scheme.type,
      scheme: scheme.scheme,
      name: scheme.name ?? name,
      value: typeof localStorage !== 'undefined'
        ? useStorage(`--oa-authorization-${name}`, usePlayground().getSecuritySchemeDefaultValue(scheme), localStorage)
        : usePlayground().getSecuritySchemeDefaultValue(scheme),
      label: name,
    }
  })
}

watch([variables, authorizations, body, selectedServer], () => {
  emits('update:request', buildRequest({
    baseUrl: String(selectedServer.value),
    method: props.method as OpenAPIV3.HttpMethods,
    path: props.path,
    variables: variables.value,
    authorizations: authorizations.value,
    body: body.value,
    parameters: props.parameters,
  }))
}, { deep: true })

watch(selectedServer, () => {
  emits('update:selectedServer', selectedServer.value)
})

watch(operationData.security.selectedSchemeId, () => {
  setAuthorizations(
    props.securityUi?.find((scheme: SecurityUiItem) => scheme.id === operationData.security.selectedSchemeId.value)?.schemes
    ?? props.securityUi?.[0]?.schemes
    ?? {},
  )
}, { immediate: true })
</script>

<template>
  <div class="OAPlaygroundParameters">
    <details v-if="serversUrls.length > 1 || allowCustomServer" open>
      <summary>
        {{ $t('Server') }}
      </summary>

      <div class="flex flex-col gap-2">
        <SelectWithCustomOption
          :model-value="selectedServer"
          :is-custom="useCustomServer"
          :custom-value="customServer"
          :default-custom-value="customServer"
          :options="serversUrls"
          :allow-custom-option="allowCustomServer"
          :custom-option-label="$t('Custom Server')"
          :custom-placeholder="$t('Enter a custom server URL')"
          :placeholder="$t('Select a server')"
          @update:model-value="selectedServer = $event"
          @update:custom-value="customServer = $event"
          @update:is-custom="useCustomServer = $event"
          @submit="emits('submit')"
        />
      </div>
    </details>

    <details v-if="authorizations?.length" open>
      <summary>
        {{ $t('Authorization') }}
        <div v-if="props.securityUi.length > 1" class="w-full max-w-[33%] md:max-w-[50%] ml-auto -mt-8">
          <Select
            :model-value="operationData.security.selectedSchemeId.value"
            @update:model-value="operationData.security.selectedSchemeId.value = String($event)"
          >
            <SelectTrigger
              aria-label="Security Scheme"
              class="h-9 px-3 py-1.5 text-foreground font-normal"
            >
              <SelectValue :placeholder="operationData.security.selectedSchemeId.value ?? $t('Select')" />
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
        {{ $t('Headers') }}
      </summary>

      <div class="flex flex-col gap-2">
        <div
          v-for="parameter in headerParameters"
          :key="parameter.name"
          class="flex flex-col gap-2"
        >
          <div class="flex flex-row items-center space-x-2">
            <span class="text-sm font-bold">{{ parameter.name }}</span>
            <span
              v-if="parameter.required"
              class="text-sm text-destructive"
            >*</span>
          </div>
          <div class="flex flex-row items-center space-x-2">
            <OAPlaygroundParameterInput
              v-model="variables[parameter.name ?? '']"
              :parameter="parameter"
              @submit="emits('submit')"
            />
          </div>
        </div>
      </div>
    </details>

    <details v-if="Object.keys(queryParameters).length || Object.keys(pathParameters).length" open>
      <summary>
        {{ $t('Variables') }}
      </summary>

      <div class="flex flex-col gap-1">
        <div class="flex flex-row gap-2">
          <div class="w-1/2 flex justify-start">
            <span class="text-xs text-muted-foreground uppercase">{{ $t('Key') }}</span>
          </div>
          <div class="w-1/2 flex justify-start">
            <span class="text-xs text-muted-foreground uppercase">{{ $t('Value') }}</span>
          </div>
        </div>

        <div
          v-for="parameter in [...pathParameters, ...queryParameters]"
          :key="parameter.name"
          class="grid grid-cols-2 gap-2 items-center"
        >
          <Label :for="parameter.name" class="text-sm font-bold space-x-2">
            <span>{{ parameter.name }}</span>
            <span
              v-if="parameter.required"
              class="text-sm text-destructive"
            >*</span>
          </Label>
          <OAPlaygroundParameterInput
            v-model="variables[parameter.name ?? '']"
            :parameter="parameter"
            @submit="emits('submit')"
          />
        </div>
      </div>
    </details>

    <details v-if="body" open>
      <summary>
        {{ $t('Body') }}
      </summary>

      <div v-if="bodyType === 'json'" class="bg-muted p-1 rounded">
        <div class="!m-0 vp-adaptive-theme min-h-16 language-json">
          <button
            title="Copy Code"
            class="copy"
          />
          <span class="lang">JSON</span>

          <OAJSONEditor v-model="body" class="w-full" />
        </div>
      </div>

      <OAPlaygroundParameterInput
        v-else
        v-model="body"
        :parameter="{ name: 'body', schema: { type: 'string' } }"
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
