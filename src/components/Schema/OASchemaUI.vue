<script setup>
import { ref } from 'vue'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Badge } from '../ui/badge'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
  deep: {
    type: Number,
    default: Infinity,
  },
  level: {
    type: Number,
    default: 0,
  },
  open: {
    type: Boolean,
    default: undefined,
  },
})

const isOpen = ref(props.open !== undefined ? props.open : props.deep > 0 && props.level <= 10)

const isObject = props.property.types?.includes('object')
const isArray = props.property.types?.includes('array')
const isObjectOrArray = isObject || isArray || props.property.type === 'object' || props.property.type === 'array'
</script>

<template>
  <div>
    <Collapsible
      v-model:open="isOpen"
      :disabled="!isObjectOrArray"
    >
      <CollapsibleTrigger class="w-full">
        <div class="flex flex-col text-start space-y-1 group select-text cursor-auto">
          <div class="flex flex-row items-center gap-2 text-sm">
            <span
              v-if="props.property.name && props.property.name.trim() !== ''"
              class="font-bold"
            >
              {{ props.property.name }}
            </span>

            <div
              v-if="isObjectOrArray && props.property.properties"
              class="flex-shrink-0 w-4 h-4 cursor-pointer"
            >
              <svg
                v-if="!isOpen"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
              ><path
                fill="currentColor"
                d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z"
              /></svg>
              <svg
                v-if="isOpen"
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
              ><path
                fill="currentColor"
                d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"
              /></svg>
            </div>

            <div class="flex flex-row items-center gap-1 text-gray-600 dark:text-gray-400">
              <Badge
                v-if="props.property.meta?.isCircularReference === true"
                variant="outline"
              >
                {{ $t('Circular Reference') }}
              </Badge>
              <template v-else-if="props.property.types.length === 1 && ['array'].includes(props.property.types[0]) && props.property.subtype">
                <span>{{ props.property.subtype }}[]</span>
              </template>
              <template v-else-if="props.property.types.length === 1 && ['object'].includes(props.property.types[0]) && props.property.subtype">
                <span>{{ props.property.subtype }}</span>
              </template>
              <template v-else-if="props.property.meta?.isConstant === true">
                <span>{{ $t('const:') }}</span>
                <span v-if="props.property.examples?.length > 0">{{ props.property.examples[0] }}</span>
              </template>
              <template v-else>
                <span v-for="(type, index) in props.property.types" :key="type">
                  {{ type }}
                  <span v-if="index !== props.property.types.length - 1">|</span>
                </span>
              </template>
            </div>

            <div class="flex-grow mx-2">
              <div
                v-if="props.property.required === true"
                class="h-px bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-800"
              />
            </div>

            <span class="text-red-800 dark:text-red-200 text-xs">{{
              props.property.required === true ? $t('Required') : ''
            }}</span>
          </div>

          <OAMarkdown
            v-if="props.property?.description"
            :content="props.property.description"
            class="text-sm text-gray-800 dark:text-gray-300"
            :class="{
              'pl-2': isObjectOrArray,
            }"
          />

          <OASchemaPropertyAttributes v-if="props.property.enum" :property="{ [$t('valid values')]: props.property.enum }" />

          <OASchemaPropertyAttributes v-if="props.property.constraints" :property="props.property.constraints" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent v-if="isObjectOrArray" class="ml-2 pl-2 border-l border-l-solid">
        <Badge
          v-if="props.property.meta?.isOneOf === true"
          variant="outline"
        >
          {{ $t('One of') }}
        </Badge>

        <div class="flex flex-col space-y-2">
          <OASchemaUI
            v-for="(subProperty, idx) in props.property.properties"
            :key="idx"
            :property="subProperty"
            :schema="props.schema"
            :deep="props.deep - 1"
            :level="props.level + 1"
            :open="subProperty?.meta?.isOneOf === true"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
