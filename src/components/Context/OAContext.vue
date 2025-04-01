<script setup lang="ts">
import { parseYAML } from 'confbox'
import { provide } from 'vue'
import { OPENAPI_LOCAL_KEY } from '../../composables/useOpenapi'
import { useShiki } from '../../composables/useShiki'
import { parseOpenapi } from '../../lib/parser/parseOpenapi'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
  },
  specUrl: {
    type: String,
    required: false,
  },
})

const emit = defineEmits(['update:spec'])

const spec = props.spec || await fetchSpec(props.specUrl)

emit('update:spec', spec)

const openapiInstance = await parseOpenapi().instanceAsync({ spec })
provide(OPENAPI_LOCAL_KEY, openapiInstance)

await useShiki().initShiki()

async function fetchSpec(url?: string): Promise<any> {
  if (!url) {
    return null
  }

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }

  if (res.headers.get('content-type')?.toLowerCase().includes('yaml') || url.endsWith('.yaml') || url.endsWith('.yml')) {
    return parseYAML(await res.text())
  }

  return res.json()
}
</script>

<template>
  <slot :openapi="openapiInstance" />
</template>
