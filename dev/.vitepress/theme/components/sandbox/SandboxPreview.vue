<script setup lang="ts">
import { useData } from 'vitepress'
import { VPHomeContent } from 'vitepress/theme'

const props = defineProps({
  specUrl: {
    type: String,
    required: true,
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
      <OARemoteSpec :spec-url="props.specUrl" :is-dark="isDark" @update:spec="emits('update:spec', $event)" />
    </VPHomeContent>
  </div>
</template>
