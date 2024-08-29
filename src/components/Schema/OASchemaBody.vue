<script setup>
const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  responseType: {
    type: String,
    default: 'object',
  },
})
</script>

<template>
  <div class="flex flex-col">
    <span
      v-if="props.responseType === 'array'"
      class="font-bold text-gray-700 dark:text-gray-300"
    >
      array of:
    </span>

    <div
      v-if="props.schema"
      class="flex flex-col pl-2 space-y-2 border-l border-gray-200 dark:border-gray-800 border-l-solid"
    >
      <OASchemaProperty
        v-for="(property, name) in props.schema.properties"
        :key="name"
        :property="property"
        :name="name"
        :schema="props.schema"
      />
    </div>
  </div>
</template>
