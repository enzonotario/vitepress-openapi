<script setup lang="ts">
import type { OpenAPIDocument } from '../../types'
import { provide } from 'vue'
import { parseOpenapi } from '@/lib/parser/parseOpenapi'
import { createOpenApiSpec } from '@/lib/spec/createOpenApiSpec'
import { OPENAPI_LOCAL_KEY } from '../../composables/useOpenapi'

const props = defineProps({
  spec: {
    type: [Object, String],
    required: false,
    default: null,
  },
  specUrl: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:spec'])

async function fetchSpec(url: string): Promise<OpenAPIDocument | string> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  }
  if (res.headers.get('content-type')?.toLowerCase().includes('yaml') || url.endsWith('.yaml') || url.endsWith('.yml')) {
    return await res.text()
  }
  return res.json()
}

async function parseSpecToDocument(spec: object | string): Promise<OpenAPIDocument> {
  if (typeof spec === 'string') {
    const { parseYAML } = await import('confbox')
    return parseYAML(spec) as OpenAPIDocument
  }
  return spec as OpenAPIDocument
}

const spec = props.spec || (props.specUrl ? await fetchSpec(props.specUrl) : null)

if (spec) {
  emit('update:spec', spec)
}

const parsedSpec = spec ? await parseOpenapi().parseAsync({ spec }) : {}

const openapiInstance = createOpenApiSpec({
  spec: parsedSpec,
  originalSpec: spec ? await parseSpecToDocument(spec) : null,
})

provide(OPENAPI_LOCAL_KEY, openapiInstance)
</script>

<template>
  <slot :openapi="openapiInstance" />
</template>
