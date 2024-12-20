<script setup lang="ts">
import OASpec from '../Common/OASpec.vue'
import OARemoteRoot from './OARemoteRoot.vue'

const props = defineProps({
  specUrl: {
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
      <OASpec :spec="spec" :is-dark="props.isDark" v-bind="$attrs" />
    </template>
  </OARemoteRoot>
</template>
