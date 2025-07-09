<script setup>
const { value } = defineProps({
  value: [String, Number, Boolean, Array, Object],
})

const getDisplayValue = (value) => {
  // We run JSON.stringify on everything except objects (which Vue handles better)
  // to distinguish `"null"` from `null`, `"1"` from `1`, etc.
  return value && typeof value === 'object' ? value : JSON.stringify(value)
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

  <code v-else class="!text-xs text-wrap break-all">
    {{ getDisplayValue(value) }}
  </code>
</template>
