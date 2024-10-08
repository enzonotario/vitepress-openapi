<script setup>
import { titleCase } from 'scule'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
})

const keysToIgnore = ['type', 'description', 'properties', 'required', 'items', 'xml', 'allOf', 'anyOf', 'oneOf', 'not']
</script>

<template>
  <div
    v-for="(key, propertyIdx) in Object.keys(props.property).filter(k => !keysToIgnore.includes(k))"
    :key="propertyIdx"
    class="flex flex-row flex-wrap items-center gap-2"
  >
    <span class="text-xs text-gray-600 dark:text-gray-300">
      {{ titleCase(key) }}
    </span>

    <template v-if="Array.isArray(props.property[key])">
      <code
        v-for="(value, attributeIdx) in props.property[key]"
        :key="attributeIdx"
        class="!text-xs text-wrap break-all"
      >
        {{ value }}
      </code>
    </template>
    <code
      v-else class="!text-xs"
    >
      {{ props.property[key] }}
    </code>
  </div>
</template>
