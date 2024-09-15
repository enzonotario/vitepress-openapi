<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue'
import { Input } from 'vitepress-theme-openapi/components/ui/input'

const props = defineProps({
  scheme: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    required: true,
  },
})

const emits = defineEmits([
  'update:modelValue',
])

const placeholder = computed(() => {
  switch (props.scheme.type) {
    case 'http':
      return props.scheme.scheme === 'basic' ? 'Basic Auth' : 'Bearer Token'
    case 'apiKey':
      return props.scheme.name
    case 'openIdConnect':
      return 'OpenID Connect'
    case 'oauth2':
      return 'OAuth2 Token'
    default:
      return ''
  }
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <Input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="bg-muted"
      @update:model-value="emits('update:modelValue', $event)"
    />
  </div>
</template>
