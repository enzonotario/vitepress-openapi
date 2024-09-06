<script setup>
const props = defineProps({
  parameter: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col p-3 gap-2 rounded bg-muted">
    <div class="flex flex-col space-y-2">
      <div class="flex flex-row items-center space-x-2">
        <span class="text-sm font-bold">{{ props.parameter.name }}</span>
        <span
          v-if="props.parameter.required"
          class="text-sm text-red-500"
        >*</span>
      </div>
      <div
        v-if="props.parameter.description"
        class="text-sm text-gray-800 dark:text-gray-100"
        v-html="props.parameter.description"
      />
    </div>
    <div
      v-if="props.parameter.schema"
      class="flex flex-col space-y-2"
    >
      <div class="flex flex-row space-x-2">
        <div
          v-if="props.parameter.schema.type"
          class="flex flex-row space-x-2 text-sm"
        >
          <span class="font-bold">
            {{ $t('Type') }}
          </span>

          <span class="text-gray-600 dark:text-gray-300">
            {{ props.parameter.schema.type }}
          </span>
        </div>

        <span
          v-if="props.parameter.required"
          class="text-sm text-red-500"
        >{{ $t('Required') }}</span>
      </div>
      <div
        v-if="props.parameter.schema.enum"
        class="flex flex-row space-x-2"
      >
        <span class="text-sm font-bold">Enum</span>
        <span class="text-sm text-gray-600 dark:text-gray-300">
          {{ props.parameter.schema.enum.join(', ') }}
        </span>
      </div>
    </div>
  </div>
</template>
