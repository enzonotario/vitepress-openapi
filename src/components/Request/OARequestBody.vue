<script setup>
import { useTheme } from '../../composables/useTheme'
import OASchemaTabs from '../Schema/OASchemaTabs.vue'

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

const defaultView = useTheme().getRequestBodyDefaultView()
</script>

<template>
  <OASchemaTabs
    :schema="props.requestBody?.content?.[props.contentType]?.ui"
    :examples="props.requestBody?.content?.[props.contentType]?.examples"
    :content-type="props.contentType"
    :default-view="defaultView"
  />
</template>
