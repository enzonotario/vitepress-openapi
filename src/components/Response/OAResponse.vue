<script setup>
import { defineProps, useSlots, ref } from 'vue'
import { useOpenapi } from 'vitepress-theme-openapi'
import { generateResponseSchema } from 'vitepress-theme-openapi/utils/generateResponseSchema'

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

const openapi = useOpenapi()

const schemas = openapi.getSchemas()

const response = props.responses[props.responseCode]

const responseType = response?.content && response?.content['application/json']?.schema?.items ? 'array' : 'object'

const schema = generateResponseSchema(schemas, response)

const schemaJson = ref(useOpenapi().propertiesTypesJson(schema, responseType))

const slots = useSlots()

function hasSlot(name) {
  return slots[name] !== undefined
}
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

    <slot
      name="body"
      :response-type="responseType"
      :schema="schema"
    />

    <slot
      name="example"
      :json="schemaJson"
    />
    <OACodeBlock
      v-if="!hasSlot('example')"
      :code="schemaJson"
      lang="json"
      label="JSON"
      :is-dark="isDark"
      class="max-h-96"
    />
  </div>
</template>
