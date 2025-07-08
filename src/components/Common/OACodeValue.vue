<script setup>
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
      {{ item }}
    </code>
  </template>

  <code
    v-else class="!text-xs text-wrap break-all"
  >
    <!-- We stringify everything except objects (which Vue does better)
     to be able to distinguish `"null"` from `null`, `"1"` from `1`, etc -->
    {{ value && typeof value === 'object' ? value : JSON.stringify(value) }}
  </code>
</template>
