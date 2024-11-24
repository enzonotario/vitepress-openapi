<script setup>
import { titleCase } from 'scule'
import OACodeValue from '../Common/OACodeValue.vue'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
})

const keysToIgnore = ['name', 'types', 'description', 'properties', 'required', 'items', 'xml', 'allOf', 'anyOf', 'oneOf', 'not']

const properties = Object.keys(props.property)
  // Filter out ignored keys.
  .filter(key => !keysToIgnore.includes(key))
  // Filter out empty objects and arrays.
  .filter((key) => {
    if (typeof props.property[key] === 'object') {
      return Object.keys(props.property[key]).length > 0
    }
    if (Array.isArray(props.property[key])) {
      return props.property[key].length > 0
    }
    return props.property[key] !== null && props.property[key] !== undefined
  })
</script>

<template>
  <div
    v-for="(key, propertyIdx) in properties"
    :key="propertyIdx"
    class="flex flex-row flex-wrap items-center gap-2"
  >
    <span class="text-xs text-gray-600 dark:text-gray-300">
      {{ titleCase(key) }}
    </span>

    <OACodeValue :value="props.property[key]" />
  </div>
</template>
