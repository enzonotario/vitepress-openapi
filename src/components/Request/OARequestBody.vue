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
})
</script>

<template>
  <OASchemaTabs
    :schema="props.requestBody?.content?.[props.contentType]?.ui"
    :examples="props.requestBody?.content?.[props.contentType]?.examples"
    :content-type="props.contentType"
  />
</template>
