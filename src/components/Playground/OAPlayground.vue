<script setup lang="ts">
import type { OpenAPIV3 } from '@scalar/openapi-types'
import { computed, defineEmits, defineProps, onBeforeUnmount, ref } from 'vue'
import OAHeading from '../Common/OAHeading.vue'
import { Button } from '../ui/button'
import OAPlaygroundParameters from './OAPlaygroundParameters.vue'
import OAPlaygroundResponse from './OAPlaygroundResponse.vue'

interface PlaygroundResponse {
  body: any
  type: string
  time: string | null
  status: number | null
}

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
  contentType: {
    type: String,
    required: false,
    default: 'application/json',
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

const defaultRequestUrl = `${props.baseUrl}${props.path}`

const loading = ref(false)

const response = ref<PlaygroundResponse | null>(null)

const imageUrls = ref<string[]>([])

const hasBody = computed(() =>
  Boolean(props.requestBody),
)

const hasSecuritySchemes = computed(() =>
  Object.keys(props.securityUi ?? {}).length > 0,
)

const hasParameters = computed(() =>
  Boolean(props.parameters?.length || hasBody.value || hasSecuritySchemes.value),
)

async function onSubmit() {
  if (!props.request) {
    return
  }

  response.value = null

  const innerResponse: PlaygroundResponse = {
    body: null,
    type: '',
    time: null,
    status: null,
  }

  trackEvent()

  const start = performance.now()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30s timeout

  try {
    innerResponse.time = null
    innerResponse.body = '{}'
    loading.value = true

    const headers = props.request.headers ?? {}
    if (props.request.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    const url = new URL(props.request.url ?? defaultRequestUrl)
    for (const [key, value] of Object.entries(props.request.query)) {
      url.searchParams.set(key, String(value))
    }

    const data = await fetch(url.toString(), {
      method: props.method.toUpperCase(),
      headers,
      body: props.request.body ? JSON.stringify(props.request.body) : null,
      signal: controller.signal,
    })

    const contentType = data.headers.get('Content-Type') || 'text/plain'
    innerResponse.type = contentType

    if (/json/i.test(contentType)) {
      innerResponse.body = await data.json()
    } else if (/xml/i.test(contentType) || /html/i.test(contentType) || /text\/plain/.test(contentType)) {
      innerResponse.body = await data.text()
    } else if (/^image\//i.test(contentType)) {
      const blob = await data.blob()
      innerResponse.body = URL.createObjectURL(blob)
      // Store the blob URL to release it later.
      imageUrls.value.push(innerResponse.body)
    } else if (/^audio\//i.test(contentType)) {
      innerResponse.body = await data.blob()
    } else {
      innerResponse.body = await data.text()
    }

    innerResponse.status = data.status
  } catch (error: any) {
    innerResponse.body = error?.message
    innerResponse.type = 'text/plain'
    innerResponse.status = 500
  } finally {
    clearTimeout(timeoutId)
    loading.value = false
    const end = performance.now()
    innerResponse.time = (end - start).toFixed(2)

    response.value = innerResponse
  }
}

function trackEvent() {
  try {
    // @ts-expect-error: gtag is defined in the global scope
    window.gtag('event', 'try_it', {
      event_category: 'api',
      event_label: props.operationId,
    })
  } catch { }
}

onBeforeUnmount(() => {
  // Release the blob URLs to prevent memory leaks.
  imageUrls.value.forEach(URL.revokeObjectURL)
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
      :examples="props.requestBody?.content?.[props.contentType]?.examples"
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
