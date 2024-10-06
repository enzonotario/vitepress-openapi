<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue'
import { usePlayground } from 'vitepress-theme-openapi'
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
  if (props.modelValue) {
    return props.modelValue
  }

  if (!props.scheme || !props.scheme.type) {
    return ''
  }

  return usePlayground().getSecuritySchemeDefaultValue(props.scheme)
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
