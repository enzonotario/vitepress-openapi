<script setup lang="ts">
import {defineEmits, defineProps, ref, watch} from 'vue'
import {useOpenapi} from '../composables/useOpenapi'

const props = defineProps({
  parameter: {
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

const inputType = (parameter) => {
  if (parameter.schema?.type === 'integer') return 'number'
  if (parameter.schema?.type === 'number') return 'number'
  return 'text'
}
</script>

<template>
  <div class="flex flex-col space-y-2">
    <input
        v-if="['string', 'number', 'integer'].includes(parameter.schema?.type) && !parameter.schema?.enum"
        :value="modelValue"
        :type="inputType(parameter)"
        :placeholder="parameter.example ?? parameter.schema?.example ?? ''"
        class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
        @input="emits('update:modelValue', $event.target.value)"
    >

    <select
        v-if="parameter.schema?.enum"
        :value="modelValue"
        class="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1"
        @input="emits('update:modelValue', $event.target.value)"
    >
      <option
          v-for="enumValue in parameter.schema.enum"
          :key="enumValue"
          :value="enumValue"
          :selected="enumValue === parameter.example"
      >
        {{ enumValue }}
      </option>
    </select>
  </div>
</template>
