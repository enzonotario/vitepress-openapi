<script setup lang="ts">
import { defineEmits, defineProps, onMounted } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'vitepress-theme-openapi/components/ui/select'
import { Input } from 'vitepress-theme-openapi/components/ui/input'

const props = defineProps({
  parameter: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean],
    required: true,
  },
})

const emits = defineEmits([
  'update:modelValue',
])

function inputType(parameter: any) {
  if (parameter.schema?.type === 'integer') {
    return 'number'
  }
  if (parameter.schema?.type === 'number') {
    return 'number'
  }
  return 'text'
}

onMounted(() => {
  if (props.parameter.schema?.enum) {
    emits('update:modelValue', props.parameter.example ?? props.parameter.schema.enum[0])
  }
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <Input
      v-if="['string', 'number', 'integer'].includes(parameter.schema?.type) && !parameter.schema?.enum"
      :value="modelValue"
      :type="inputType(parameter)"
      :placeholder="parameter.example ?? parameter.schema?.example ?? ''"
      class="bg-muted"
      @update:model-value="emits('update:modelValue', $event)"
    />

    <Select
      v-if="parameter.schema?.enum"
      @update:model-value="emits('update:modelValue', $event)"
    >
      <SelectTrigger>
        <SelectValue :placeholder="String(parameter.example ?? parameter.schema?.example ?? 'Seleccionar...')" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="enumValue in parameter.schema.enum"
            :key="enumValue"
            :value="String(enumValue)"
          >
            {{ enumValue }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>
