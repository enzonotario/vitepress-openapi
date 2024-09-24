<script setup>
import { Badge } from 'vitepress-theme-openapi/components/ui/badge'
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
    v-for="(key, idx) in Object.keys(props.property).filter(k => !keysToIgnore.includes(k))"
    :key="idx"
    class="flex flex-row flex-wrap items-center gap-2"
  >
    <span class="text-xs text-gray-600 dark:text-gray-300">
      {{ titleCase(key) }}
    </span>

    <template v-if="Array.isArray(props.property[key])">
      <Badge
        v-for="(value, idx) in props.property[key]"
        :key="idx"
        variant="plain"
        size="xs"
        class="bg-muted"
      >
        {{ value }}
      </Badge>
    </template>
    <template v-else>
      <Badge
        variant="plain"
        size="xs"
        class="bg-muted"
      >
        {{ props.property[key] }}
      </Badge>
    </template>
  </div>
</template>
