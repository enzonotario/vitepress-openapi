<script setup lang="ts">
import type { Ref } from 'vue'
import type { ParsedOperation } from '../../types'
import { ref } from 'vue'
import { providePlaygroundData } from '../../lib/playgroundData'

const props = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
})

const operations = props.openapi.getOperations()

const selectedOperation: Ref<ParsedOperation | null> = ref(
  operations.length > 0
    ? operations[0]
    : null,
)

providePlaygroundData({
  selectedOperation,
})
</script>

<template>
  <slot :selected-operation="selectedOperation" />
</template>
