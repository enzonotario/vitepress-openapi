<script setup>
import { generateSchemaJson } from 'vitepress-theme-openapi/utils/generateSchemaJson'

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

const schemaJson = generateSchemaJson(schema)
</script>

<template>
  <OASchemaTabs
    :schema="schema"
    :schema-json="schemaJson"
    :is-dark="props.isDark"
  />
</template>

