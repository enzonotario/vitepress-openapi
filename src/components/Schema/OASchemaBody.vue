<script setup>
const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  deep: {
    type: Number,
    default: Infinity,
  },
  visited: {
    type: Set,
    default: () => new Set(),
  },
  level: {
    type: Number,
    default: 0,
  },
})

const primitiveSchemasTypes = ['string', 'number', 'integer', 'boolean']
const isCircularRef = props.visited.has(props.schema) && props.level > 10

if (!isCircularRef) {
  props.visited.add(props.schema)
}
</script>

<template>
  <div class="flex flex-col">
    <div v-if="isCircularRef">
      <span class="text-gray-700 dark:text-gray-300">[Circular Reference]</span>
    </div>

    <div v-else-if="primitiveSchemasTypes.includes(props.schema.type)">
      <OASchemaPrimitiveProperty :property="props.schema" />
    </div>

    <div
      v-else-if="props.schema?.properties"
      class="flex flex-col pl-2 space-y-2 border-l border-l-solid"
    >
      <OASchemaProperty
        v-for="(property, name) in props.schema.properties"
        :key="name"
        :property="property"
        :name="name"
        :schema="props.schema"
        :deep="props.deep - 1"
        :visited="new Set(visited)"
        :level="level + 1"
      />
    </div>

    <div
      v-else-if="props.schema?.items"
      class="flex flex-col pl-2 space-y-2 border-l border-l-solid"
    >
      <span class="text-gray-700 dark:text-gray-300">
        array of:
      </span>

      <OASchemaBody
        :schema="props.schema.items"
        :deep="props.deep - 1"
        :visited="new Set(visited)"
        :level="level + 1"
      />
    </div>
  </div>
</template>
