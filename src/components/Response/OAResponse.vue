<script setup>
import { computed, defineProps, ref } from 'vue'
import { useTheme } from '../../client'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

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
})

const contentTypes = Object.keys(props.response.content ?? {})

const contentType = ref(contentTypes[0] ?? undefined)

const schema = computed(() => props.response.content?.[contentType.value]?.ui)

const examples = computed(() => props.response.content?.[contentType.value]?.examples)

const contentTypeId = `content-type-${Math.random().toString(36).substring(7)}`

const defaultView = useTheme().getResponseBodyDefaultView()
</script>

<template>
  <div class="flex flex-col space-y-4">
    <span class="text-gray-800 dark:text-gray-200 text-lg">{{ props.response.description }}</span>

    <div
      v-if="props.response?.content && contentTypes.length"
      class="flex flex-row items-center gap-2 text-xs"
    >
      <Label
        :for="contentTypeId"
        class="flex-shrink-0 text-gray-600 dark:text-gray-400"
      >
        {{ $t('Content-Type') }}
      </Label>
      <div class="flex-shrink-0">
        <Select
          v-if="contentTypes.length > 1"
          :id="contentTypeId"
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
        <span v-else class="h-6 text-xs rounded-md bg-muted px-3 py-1">{{ contentType }}</span>
      </div>
    </div>

    <OASchemaTabs
      v-if="schema"
      :schema="schema"
      :examples="examples"
      :content-type="contentType"
      :default-view="defaultView"
    />
  </div>
</template>
