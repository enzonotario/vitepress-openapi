<script setup>
const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <OASchemaTabs
    :schema="props.schema"
    :is-dark="props.isDark"
  />
</template>

