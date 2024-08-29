<script setup>
import { useOpenapi } from 'vitepress-theme-openapi'
import { generateRequestBodySchema } from 'vitepress-theme-openapi/utils/generateRequestBodySchema'
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

const openapi = useOpenapi()

const schema = props.operation?.requestBody?.content?.['application/json']?.schema

const schemaJson = generateSchemaJson(schema)
</script>

<template>
  <div>
    <OASchemaTabs
      :schema="schema"
      :schema-json="schemaJson"
      :is-dark="props.isDark"
    />
  </div>
</template>

