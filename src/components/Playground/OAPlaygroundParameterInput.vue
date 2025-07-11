<script setup lang="ts">
import { useI18n } from '@byjohann/vue-i18n'
import { defineEmits, defineProps, onMounted } from 'vue'
import { getPropertyExample } from '../../lib/examples/getPropertyExample'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const props = defineProps({
  parameter: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean, null, Array, Object],
    required: true,
  },
  compositeKey: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  hideLabel: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits([
  'update:modelValue',
  'update:enabled',
  'submit',
])

function handleInputChange(value: any) {
  if (!props.enabled) {
    emits('update:enabled', true)
  }

  emits('update:modelValue', value)
}

function inputType(parameter: any) {
  if (parameter.schema?.type === 'integer') {
    return 'number'
  }
  if (parameter.schema?.type === 'number') {
    return 'number'
  }
  if (parameter.schema?.format === 'binary') {
    return 'file'
  }
  return 'text'
}

onMounted(() => {
  if (props.parameter.schema?.enum) {
    emits('update:modelValue', getPropertyExample(props.parameter) ?? props.parameter.schema.enum[0])
  }
})

const parameterExample = getPropertyExample(props.parameter)
const { t } = useI18n()
</script>

<template>
  <div class="grid gap-2 items-center" :class="{ 'grid-cols-2': !hideLabel, 'grid-cols-1': hideLabel }">
    <div v-if="!hideLabel" class="flex items-center gap-2">
      <Checkbox
        :id="`enable-${compositeKey}`"
        :name="`enable-${compositeKey}`"
        :model-value="enabled"
        variant="toggle"
        @update:model-value="emits('update:enabled', $event)"
      />

      <Label v-if="parameter.name" :for="compositeKey" class="text-sm font-bold space-x-2">
        <span>{{ parameter.name }}</span>
        <span
          v-if="parameter.required"
          class="text-sm text-destructive"
        >*</span>
      </Label>
    </div>

    <div
      class="flex items-center flex-grow gap-2"
      :class="{ 'opacity-50': !enabled }"
    >
      <Checkbox
        v-if="['boolean'].includes(parameter.schema?.type)"
        :id="compositeKey"
        :name="compositeKey"
        :model-value="String(modelValue) === '' ? 'indeterminate' : (modelValue as boolean)"
        @update:model-value="handleInputChange($event)"
        @keydown.enter="emits('submit')"
      />

      <Select
        v-else-if="parameter.schema?.enum"
        :id="compositeKey"
        :name="compositeKey"
        @update:model-value="handleInputChange($event)"
      >
        <SelectTrigger :aria-label="String(parameterExample ?? t('Select'))">
          <SelectValue :placeholder="String(parameterExample ?? t('Select'))" />
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

      <Input
        v-else
        :id="compositeKey"
        :name="compositeKey"
        :value="modelValue"
        :type="inputType(parameter)"
        :placeholder="String(parameterExample ?? '')"
        class="bg-muted"
        @update:model-value="handleInputChange($event)"
        @keydown.enter="emits('submit')"
      />
    </div>
  </div>
</template>
