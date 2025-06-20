<script setup lang="ts">
import type { OpenAPIDocument } from '../../types'
import { parseYAML } from 'confbox'
import { OpenApi } from '../../lib/OpenApi'
import { parseOpenapi } from '../../lib/parser/parseOpenapi'
import OAContext from './OAContext.vue'

const props = defineProps({
  spec: {
    type: [Object, String],
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

const openapiInstance = OpenApi({
  spec: await parseOpenapi().parseAsync({ spec }),
  originalSpec: parseSpecToDocument(spec),
})

async function fetchSpec(url?: string): Promise<any> {
  if (!url) {
    return null
  }

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
</script>

<template>
  <OAContext :openapi="openapiInstance">
    <template #default="{ openapi }">
      <slot :openapi="openapi" />
    </template>
  </OAContext>
</template>
