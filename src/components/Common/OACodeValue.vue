<script setup>
const { value } = defineProps({
  value: [String, Number, Boolean, Array, Object],
})

const getDisplayValue = (value) => {
  // We run JSON.stringify on everything except objects (which Vue handles better)
  // to distinguish `"null"` from `null`, `"1"` from `1`, etc.
  const space = value && typeof value === 'object' && !Array.isArray(value) ? 2 : 0
  return JSON.stringify(value, null, space)
}
</script>

<template>
  <template v-if="Array.isArray(value)">
    <code
      v-for="(item, attributeIdx) in value"
      :key="attributeIdx"
      class="!text-xs text-wrap break-all"
    >
      {{ getDisplayValue(item) }}
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
    {{ getDisplayValue(value) }}
  </code>
</template>
