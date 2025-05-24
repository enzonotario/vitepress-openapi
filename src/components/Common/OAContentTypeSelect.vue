<script setup>
import { ref, watch } from 'vue'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select/index'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  contentTypes: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const contentType = ref(props.modelValue || props.contentType || (props.contentTypes.length > 0 ? props.contentTypes[0] : undefined))

watch(contentType, (newValue) => {
  emit('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  if (newValue !== contentType.value) {
    contentType.value = newValue
  }
})
</script>

<template>
  <div>
    <Select
      v-if="contentTypes.length > 1"
      v-model="contentType"
    >
      <SelectTrigger
        aria-label="Content-Type"
        class="h-6 text-xs"
      >
        <SelectValue>{{ contentType }}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="(type, idx) in contentTypes"
            :key="idx"
            :value="type"
          >
            {{ type }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <div v-else class="ml-auto max-w-40 hover:max-w-full truncate transition-all duration-200 ease-in-out">
      <span class="h-6 text-xs rounded-md bg-muted px-3 py-1">{{ contentType }}</span>
    </div>
  </div>
</template>
