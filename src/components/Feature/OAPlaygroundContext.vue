<script setup lang="ts">
import type { Ref } from 'vue'
import type { ParsedOperation } from '../../types'
import { useData, useRouter } from 'vitepress'
import { computed, ref, watch } from 'vue'
import { resolveSelectedPlaygroundOperation } from '../../lib/playground/resolveSelectedPlaygroundOperation'
import { providePlaygroundData } from '../../lib/playgroundData'

const props = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
})

const { hash } = useData()
const router = useRouter()
const operations = computed(() => props.openapi.getOperations() as ParsedOperation[])

const selectedOperation: Ref<ParsedOperation | null> = ref(null)

watch(
  [hash, operations],
  async ([currentHash, currentOperations]) => {
    selectedOperation.value = resolveSelectedPlaygroundOperation({
      hash: currentHash,
      operations: currentOperations,
    })

    const operationId = selectedOperation.value?.operationId
    const expectedHash = operationId ? `#${encodeURIComponent(operationId)}` : ''

    if (!operationId || currentHash === expectedHash || typeof window === 'undefined') {
      return
    }

    await router.go(`${window.location.pathname}${window.location.search}${expectedHash}`)
  },
  {
    immediate: true,
  },
)

providePlaygroundData({
  selectedOperation,
})
</script>

<template>
  <slot :selected-operation="selectedOperation" />
</template>
