<script setup>
const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  responseType: {
    type: String,
    required: true,
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
      class="flex flex-col pl-3 space-y-2 border-l-2 border-gray-200 dark:border-gray-800 border-l-solid"
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
