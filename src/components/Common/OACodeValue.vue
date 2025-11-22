<script setup>
const { value } = defineProps({
  value: [String, Number, Boolean, Array, Object],
})

const getDisplayValue = (value) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return JSON.stringify(value, null, 2)
  }
  return JSON.stringify(value)
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
