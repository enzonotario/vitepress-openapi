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
    v-else class="!text-xs"
  >
    {{ value }}
  </code>
</template>
