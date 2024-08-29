<script setup>
import { defineProps } from 'vue'
import { generateSchemaJson } from 'vitepress-theme-openapi/utils/generateSchemaJson'

const props = defineProps({
  responses: {
    type: Object,
    required: true,
  },
  responseCode: {
    type: String,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const response = props.responses[props.responseCode]

const schema = response?.content?.['application/json']?.schema

const schemaJson = generateSchemaJson(schema)
</script>

<template>
  <div class="flex flex-col space-y-4">
    <span class="text-gray-800 dark:text-gray-200 text-lg">{{ responses[responseCode].description }}</span>

    <div
      v-if="responses[responseCode]?.content"
      class="flex flex-row items-center text-xs space-x-2"
    >
      <span class="text-gray-600 dark:text-gray-400">Content-Type:</span>
      <span class="text-gray-800 dark:text-gray-200">{{ Object.keys(responses[responseCode].content)[0] }}</span>
    </div>

    <OASchemaTabs
      v-if="schema"
      :schema="schema"
      :schema-json="schemaJson"
      :is-dark="props.isDark"
    />
  </div>
</template>
