<script setup lang="ts">
import { defineEmits, defineProps, onMounted } from 'vue'
import { getPropertyExample } from '../../lib/examples/getPropertyExample'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

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
    emits('update:modelValue', getPropertyExample(props.parameter) ?? props.parameter.schema.enum[0])
  }
})

const parameterExample = getPropertyExample(props.parameter)
</script>

<template>
  <div class="flex flex-col space-y-2">
    <Input
      v-if="['string', 'number', 'integer'].includes(parameter.schema?.type) && !parameter.schema?.enum"
      :value="modelValue"
      :type="inputType(parameter)"
      :placeholder="String(parameterExample ?? '')"
      class="bg-muted"
      @update:model-value="emits('update:modelValue', $event)"
    />

    <Checkbox
      v-if="['boolean'].includes(parameter.schema?.type)"
      :checked="String(modelValue) === '' ? 'indeterminate' : (modelValue as boolean)"
      @update:checked="emits('update:modelValue', $event)"
    />

    <Select
      v-if="parameter.schema?.enum"
      @update:model-value="emits('update:modelValue', $event)"
    >
      <SelectTrigger :aria-label="String(parameterExample ?? $t('Select...'))">
        <SelectValue :placeholder="String(parameterExample ?? $t('Select...'))" />
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
