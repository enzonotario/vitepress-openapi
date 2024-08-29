<script setup>
import { ref } from 'vue'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'vitepress-theme-openapi/components/ui/collapsible'
import { Badge } from 'vitepress-theme-openapi/components/ui/badge'
import { titleCase } from 'scule'
import OASchemaBody from './OASchemaBody.vue'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
})

const isOpen = ref(true)
</script>

<template>
  <Collapsible
    v-model:open="isOpen"
    :disabled="!props.property?.properties"
  >
    <CollapsibleTrigger class="w-full">
      <div class="flex flex-col text-start space-y-1 group">
        <div class="flex flex-row items-center text-sm">
          <div
            v-if="props.property?.properties"
            class="flex-shrink-0 w-4 h-4"
          >
            <svg
              v-if="!isOpen"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            ><path
              fill="currentColor"
              d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z"
            /></svg>
            <svg
              v-if="isOpen"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            ><path
              fill="currentColor"
              d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"
            /></svg>
          </div>

          <span class="font-bold">{{ props.name }}</span>

          <span class="ml-2 text-gray-600 dark:text-gray-400">{{ props.property?.type }}</span>

          <div class="flex-grow mx-2">
            <div
              v-if="props.schema.required && props.schema.required.includes(name)"
              class="h-px bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-800"
            />
          </div>

          <span class="text-red-800 dark:text-red-200 text-xs">{{ props.schema.required && props.schema.required.includes(name) ? $t('Required') : '' }}</span>
        </div>

        <div
          v-if="props.property?.description"
          class="text-sm text-gray-800 dark:text-gray-300"
          v-html="props.property.description"
        />

        <div
          v-for="(key, idx) in Object.keys(props.property).filter(k => ![ 'type', 'description', 'properties', 'required' ].includes(k))"
          :key="idx"
          class="flex flex-row items-center space-x-2"
        >
          <span class="text-xs text-gray-600 dark:text-gray-300">
            {{ titleCase(key) }}
          </span>

          <template v-if="Array.isArray(props.property[key])">
            <Badge
              v-for="(value, idx) in props.property[key]"
              :key="idx"
              variant="outline"
              class="bg-muted rounded text-xs px-1"
            >
              {{ value }}
            </Badge>
          </template>
          <template v-else>
            <Badge
              variant="outline"
              class="bg-muted rounded text-xs px-1"
            >
              {{ props.property[key] }}
            </Badge>
          </template>
        </div>
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <OASchemaBody
        v-if="[ 'object', 'array' ].includes(props.property.type)"
        :schema="props.property"
        :response-type="props.property.type"
        class="pl-4 mt-1"
      />
    </CollapsibleContent>
  </Collapsible>
</template>
