<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OperationData } from '../../lib/operationData'
import { computed, defineEmits, defineProps, inject, onBeforeUnmount } from 'vue'
import { usePlayground } from '../../composables/usePlayground'
import { OPERATION_DATA_KEY } from '../../lib/operationData'
import OAHeading from '../Common/OAHeading.vue'
import { Button } from '../ui/button'
import OAPlaygroundParameters from './OAPlaygroundParameters.vue'
import OAPlaygroundResponse from './OAPlaygroundResponse.vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  baseUrl: {
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
  hideEndpoint: {
    type: Boolean,
    default: false,
  },
  servers: {
    type: Array,
    default: () => [],
  },
  parameters: {
    type: Array<OpenAPIV3.ParameterObject>,
    required: false,
  },
  requestBody: {
    type: Object,
    required: false,
  },
  securityUi: {
    type: Object,
    required: true,
  },
  request: {
    type: Object,
  },
  headingPrefix: {
    type: String,
    required: false,
    default: '',
  },
})

const emits = defineEmits([
  'update:request',
  'update:selectedServer',
])

const { loading, response, submitRequest, cleanupImageUrls } = usePlayground()

const operationData = inject(OPERATION_DATA_KEY) as OperationData

const hasBody = computed(() =>
  Boolean(props.requestBody),
)

const hasSecuritySchemes = computed(() =>
  Object.keys(props.securityUi ?? {}).length > 0,
)

const hasParameters = computed(() =>
  Boolean(props.parameters?.length || hasBody.value || hasSecuritySchemes.value),
)

const examples = computed(() => {
  return props.requestBody?.content?.[operationData.request.selectedContentType.value]?.examples
})

async function onSubmit() {
  if (!props.request) {
    return
  }

  await submitRequest({
    request: props.request,
    method: props.method,
    baseUrl: props.baseUrl,
    path: props.path,
    operationId: props.operationId,
  })
}

onBeforeUnmount(() => {
  cleanupImageUrls()
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <OAHeading
      level="h2"
      :prefix="headingPrefix"
      class="block sm:hidden"
    >
      {{ $t('Playground') }}
    </OAHeading>

    <OAPlaygroundParameters
      v-if="hasParameters"
      :request="props.request"
      :operation-id="props.operationId"
      :path="props.path"
      :method="props.method"
      :base-url="props.baseUrl"
      :servers="props.servers"
      :parameters="props.parameters ?? []"
      :security-ui="props.securityUi ?? {}"
      :examples="examples"
      :request-body="props.requestBody"
      @update:request="($event: any) => emits('update:request', $event)"
      @update:selected-server="($event: any) => emits('update:selectedServer', $event)"
      @submit="onSubmit"
    />

    <div class="flex flex-col gap-2">
      <Button variant="primary" @click="onSubmit">
        {{ $t('Try it out') }}
      </Button>

      <OAPlaygroundResponse
        v-if="response || loading"
        :response="response"
        :loading="loading"
      />
    </div>
  </div>
</template>
