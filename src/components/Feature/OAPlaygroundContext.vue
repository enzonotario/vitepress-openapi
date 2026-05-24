<script setup lang="ts">
import type { Ref } from 'vue'
import type { ParsedOperation } from '../../types'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { resolveSelectedPlaygroundOperation } from '../../lib/playground/resolveSelectedPlaygroundOperation'
import { providePlaygroundData } from '../../lib/playgroundData'

const props = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
})

const operations = props.openapi.getOperations()
const currentHash = ref(typeof window !== 'undefined' ? window.location.hash : '')

const selectedOperation: Ref<ParsedOperation | null> = ref(null)

watch(
  currentHash,
  (hash) => {
    selectedOperation.value = resolveSelectedPlaygroundOperation({
      hash,
      operations,
    })
  },
  {
    immediate: true,
  },
)

function syncHashFromLocation() {
  currentHash.value = window.location.hash
}

onMounted(() => {
  syncHashFromLocation()
  window.addEventListener('hashchange', syncHashFromLocation)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', syncHashFromLocation)
})

providePlaygroundData({
  selectedOperation,
})
</script>

<template>
  <slot :selected-operation="selectedOperation" />
</template>
