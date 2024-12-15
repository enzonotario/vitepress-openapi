<script setup lang="ts">
import {
  parseYAML,
} from 'confbox'

const props = defineProps({
  specUrl: {
    type: String,
    required: true,
  },
})

const emits = defineEmits([
  'update:spec',
])

const spec = await fetchSpec(props.specUrl)

async function fetchSpec(url: string) {
  const spec = await parseSpec(url)

  emits('update:spec', spec)

  return spec
}

async function parseSpec(url: string) {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }

  if (res.headers.get('content-type')?.includes('text/yaml') || url.endsWith('.yaml') || url.endsWith('.yml')) {
    return parseYAML(await res.text())
  }

  return res.json()
}
</script>

<template>
  <slot :spec="spec" />
</template>
