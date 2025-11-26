<script setup>
import { formatValueForDisplay } from '../../lib/format/formatValueForDisplay'

const { value } = defineProps({
  value: [String, Number, Boolean, Array, Object],
})
</script>

<template>
  <template v-if="Array.isArray(value)">
    <code
      v-for="(item, attributeIdx) in value"
      :key="attributeIdx"
      class="!text-xs text-wrap break-all"
    >
      {{ formatValueForDisplay(item) }}
    </code>
  </template>

  <code
    v-else
    class="!text-xs break-all"
    :class="{
      'text-wrap': !value || typeof value !== 'object',
      'whitespace-pre-wrap': value && typeof value === 'object',
    }"
  >
    {{ formatValueForDisplay(value) }}
  </code>
</template>
