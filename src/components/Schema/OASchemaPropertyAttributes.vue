<script setup>
import { titleCase } from 'scule'
import OACodeValue from 'vitepress-openapi/components/Common/OACodeValue.vue'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
})

const keysToIgnore = ['type', 'description', 'properties', 'required', 'items', 'xml', 'allOf', 'anyOf', 'oneOf', 'not']

const properties = Object.keys(props.property).filter(key => !keysToIgnore.includes(key))
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
