<script setup>
import OASchemaBody from "./OASchemaBody.vue";

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-row space-x-4 text-sm">
      <span class="font-bold">{{ props.name }}</span>
      <span class="text-gray-600 dark:text-gray-400">{{ props.property?.type }}</span>
      <span class="flex-grow" />
      <span class="text-red-800 dark:text-red-200 text-xs">{{ props.schema.required && props.schema.required.includes(name) ? $t('Required') : '' }}</span>
    </div>

    <div
      v-if="props.property?.description"
      class="text-sm text-gray-800 dark:text-gray-300"
      v-html="props.property.description"
    />

    <OASchemaBody
      v-if="[ 'object', 'array' ].includes(props.property.type)"
      :schema="props.property"
      :response-type="props.property.type"
      class="pl-4 mt-1"
    />
  </div>
</template>
