<script setup lang="ts">
import type { OpenAPIDocument } from '../../types'
import { parseYAML } from 'confbox'
import { provide } from 'vue'
import { OPENAPI_LOCAL_KEY } from '../../composables/useOpenapi'
import { parseOpenapi } from '../../lib/parser/parseOpenapi'
import { createOpenApiSpec } from '../../lib/spec/createOpenApiSpec'

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

function parseSpecToDocument(spec: object | string): OpenAPIDocument {
  if (typeof spec === 'string') {
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
  originalSpec: spec ? parseSpecToDocument(spec) : null,
})

provide(OPENAPI_LOCAL_KEY, openapiInstance)
</script>

<template>
  <slot :openapi="openapiInstance" />
</template>
