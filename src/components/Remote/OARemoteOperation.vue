<script setup lang="ts">
import OARemoteRoot from './OARemoteRoot.vue'

const props = defineProps({
  specUrl: {
    type: String,
    required: true,
  },
  operationId: {
    type: String,
    required: true,
  },
  isDark: Boolean,
})

const emits = defineEmits([
  'update:spec',
])
</script>

<template>
  <OARemoteRoot :spec-url="props.specUrl" @update:spec="emits('update:spec', $event)">
    <template #default="{ spec }">
      <OAOperation
        :spec="spec"
        :operation-id="props.operationId"
        :is-dark="props.isDark"
        v-bind="$attrs"
      />
    </template>
  </OARemoteRoot>
</template>
