<script setup>
import { useOpenapi } from '../composables/useOpenapi'
import { codeToHtml } from 'shikiji'
import { ref, onMounted, useSlots } from "vue";

const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  responses: {
    type: Object,
    required: true,
  },
  responseType: {
    type: String,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()

const responsesCodes = Object.keys(props.responses)

const schemaJson = ref(useOpenapi().propertiesTypesJson(props.schema, props.responseType))

onMounted(async () => {
  if (schemaJson.value) {
    schemaJson.value = await codeToHtml(schemaJson.value, {
      lang: 'json',
      theme: props.isDark ? 'vitesse-dark' : 'vitesse-light',
    })
  }
})

function hasSlot(name) {
  return slots[name] !== undefined
}
</script>

<template>
  <div class="flex flex-col">
    <div v-for="responseCode in responsesCodes" :key="responseCode" class="flex flex-col space-y-4">
      <div class="flex flex-row items-center space-x-4">
        <span
          class="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
        >
          {{ responseCode }}
        </span>

        <span class="text-gray-800 dark:text-gray-200 text-lg">{{ responses[responseCode].description }}</span>
      </div>

      <div class="flex flex-row items-center text-xs space-x-2">
        <span class="text-gray-600 dark:text-gray-400">Content-Type:</span>
        <span class="text-gray-800 dark:text-gray-200">{{ Object.keys(responses[responseCode].content)[0] }}</span>
      </div>

      <slot name="body" :response-type="responseType" :schema="props.schema" />

      <slot name="example" :json="schemaJson" />

      <div v-if="!hasSlot('example')" v-html="schemaJson" class="p-2 border border-gray-200 dark:border-gray-700 rounded" />
    </div>
  </div>
</template>
