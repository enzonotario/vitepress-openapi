<script setup>
import { defineProps, ref } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'vitepress-theme-openapi/components/ui/select'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  response: {
    type: Object,
    required: true,
  },
  responseCode: {
    type: String,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const contentTypes = Object.keys(props.response.content ?? {})

const contentType = ref(contentTypes[0] ?? '')

const schema = props.response.content?.[contentType.value]?.schema
</script>

<template>
  <div class="flex flex-col space-y-4">
    <span class="text-gray-800 dark:text-gray-200 text-lg">{{ props.response.description }}</span>

    <div
      v-if="props.response?.content && contentTypes.length"
      class="flex flex-row items-center gap-2 text-xs"
    >
      <span class="flex-shrink-0 text-gray-600 dark:text-gray-400">Content-Type</span>
      <div class="flex-shrink-0">
        <Select v-model="contentType">
          <SelectTrigger class="h-6 text-xs">
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
      </div>
    </div>

    <OASchemaTabs
      v-if="schema"
      :schema="schema"
      :content-type="contentType"
      :is-dark="props.isDark"
    />
  </div>
</template>
