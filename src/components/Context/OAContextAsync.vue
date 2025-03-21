<script setup lang="ts">
import { parseYAML } from 'confbox'
import { parseOpenapi } from '../../lib/parser/parseOpenapi'
import OAContext from './OAContext.vue'

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

const openapi = await parseOpenapi().instanceAsync({ spec })

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
  <OAContext :openapi="openapi">
    <template #default="{ openapi }">
      <slot :openapi="openapi" />
    </template>
  </OAContext>
</template>
