<script setup lang="ts">
import OASpec from '../Feature/OASpec.vue'
import OARemoteRoot from './OARemoteRoot.vue'

const props = defineProps({
  specUrl: {
    type: String,
    required: true,
  },
})

const emits = defineEmits([
  'update:spec',
])
</script>

<template>
  <OARemoteRoot :spec-url="props.specUrl" @update:spec="emits('update:spec', $event)">
    <template #default="{ spec }">
      <OASpec :spec="spec" v-bind="$attrs" />
    </template>
  </OARemoteRoot>
</template>
