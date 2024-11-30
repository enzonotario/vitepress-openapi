<script setup>
const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  requestBody: {
    type: Object,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <OASchemaTabs
    :schema="props.requestBody?.content?.[props.contentType]?.ui"
    :schema-ui-content-type="props.requestBody?.content?.[props.contentType]?.uiContentType"
    :content-type="props.contentType"
    :is-dark="props.isDark"
  />
</template>
