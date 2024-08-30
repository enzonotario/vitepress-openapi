<script setup>
const props = defineProps({
  operation: {
    type: Object,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const schema = props.operation?.requestBody?.content?.['application/json']?.schema
</script>

<template>
  <OASchemaTabs
    :schema="schema"
    :is-dark="props.isDark"
  />
</template>

