<script setup lang="ts">
import { ref } from 'vue'
import { Button } from 'vitepress-openapi/components/ui/button'
import { Badge } from 'vitepress-openapi/components/ui/badge'

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
  request: {
    type: Object,
    default: () => ({
      url: '',
      headers: {},
      body: {},
    }),
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits([
  'response',
  'loading',
])

const defaultRequestUrl = `${props.baseUrl}${props.path}`

const response = ref<PlaygroundResponse | null>(null)

const loading = ref(false)

async function tryIt() {
  response.value = null

  const innerResponse: PlaygroundResponse = {
    body: null,
    type: '',
    time: null,
    status: null,
  }

  trackTryIt()

  const start = performance.now()

  try {
    innerResponse.time = null
    innerResponse.body = '{}'
    setLoading(true)

    const headers = props.request.headers ?? {}
    if (props.request.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    const data = await fetch(props.request.url ?? defaultRequestUrl, {
      method: props.method.toUpperCase(),
      headers,
      body: props.request.body ? JSON.stringify(props.request.body) : null,
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
    } else if (/^audio\//i.test(contentType)) {
      innerResponse.body = await data.blob()
    } else {
      innerResponse.body = await data.text()
    }

    innerResponse.status = data.status
  } catch (error) {
    innerResponse.body = error.message
    innerResponse.type = 'text/plain'
    innerResponse.status = 500
  } finally {
    setLoading(false)
    const end = performance.now()
    innerResponse.time = (end - start).toFixed(2)

    emits('response', innerResponse)
    response.value = innerResponse
  }
}

function trackTryIt() {
  try {
    window.gtag('event', 'try_it', {
      event_category: 'api',
      event_label: props.operationId,
    })
  } catch { }
}

function setLoading(value) {
  loading.value = value
  emits('loading', value)
}
</script>

<template>
  <div class="flex flex-col">
    <Button variant="primary" @click="tryIt">
      {{ $t('Try it out') }}
    </Button>

    <div v-if="response || loading" class="flex flex-col">
      <details class="flex flex-col" open>
        <summary class="my-0! text-lg font-bold cursor-pointer">
          <div class="inline-flex items-center gap-2 w-[calc(100%-24px)]">
            <span>{{ loading ? $t('Loading...') : $t('Response') }}</span>

            <span class="flex-1" />

            <Badge
              v-if="response && response.status"
              variant="plain"
              class="rounded py-1.5"
              :class="{
                'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100': String(response.status).startsWith('2'),
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100': String(response.status).startsWith('3'),
                'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100': String(response.status).startsWith('4') || String(response.status).startsWith('5'),
              }"
            >
              {{ response.status }}
            </Badge>
          </div>
        </summary>

        <div v-if="response" class="text-sm text-gray-500">
          {{ $t('Response time') }}: {{ loading ? $t('Loading...') : `${response.time}ms` }}
        </div>

        <div class="flex flex-col max-h-96 overflow-y-auto">
          <slot
            v-if="response"
            name="response"
            :response="response"
            :is-dark="props.isDark"
          />
        </div>
      </details>
    </div>
  </div>
</template>
