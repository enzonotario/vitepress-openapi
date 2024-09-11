<script setup>
const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col text-start space-y-1 group">
    <div
      v-if="props.property.type"
      class="flex flex-row items-center text-sm"
    >
      <span class="text-gray-600 dark:text-gray-400">{{ props.property.type }}</span>
    </div>

    <OAMarkdown
      v-if="props.property.description"
      :content="props.property.description"
      class="text-sm text-gray-800 dark:text-gray-300"
    />

    <OASchemaPropertyAttributes :property="props.property" />
  </div>
</template>
