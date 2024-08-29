<script setup>
const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col">
    <div
      v-if="props.schema?.properties"
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

    <div
      v-else-if="props.schema?.items"
      class="flex flex-col pl-2 space-y-2 border-l border-gray-200 dark:border-gray-800 border-l-solid"
    >
      <span class="text-gray-700 dark:text-gray-300">
        array of:
      </span>

      <OASchemaBody
        :schema="props.schema.items"
      />
    </div>
  </div>
</template>
