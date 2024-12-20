<script setup lang="ts">
import { useData } from 'vitepress'
import { VPHomeContent } from 'vitepress/theme'

const props = defineProps({
  specUrl: {
    type: String,
    required: true,
  },
  operationId: {
    type: String,
    required: true,
  },
  previewType: {
    type: String,
    required: false,
    default: 'oneOperation',
  },
})

const emits = defineEmits([
  'update:spec',
])

const { isDark } = useData()
</script>

<template>
  <div style="padding: 48px 32px;">
    <VPHomeContent>
      <OARemoteOperation
        v-if="previewType === 'oneOperation'"
        :key="props.operationId"
        :operation-id="props.operationId"
        :spec-url="props.specUrl"
        :is-dark="isDark"
        @update:spec="emits('update:spec', $event)"
      />
      <OARemoteSpec
        v-else-if="previewType === 'spec'"
        :spec-url="props.specUrl"
        :is-dark="isDark"
        @update:spec="emits('update:spec', $event)"
      />
    </VPHomeContent>
  </div>
</template>
