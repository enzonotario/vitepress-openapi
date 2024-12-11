<script setup>
import OACodeValue from '../Common/OACodeValue.vue'
import { getConstraints } from '../../lib/constraintsParser'
import { getExamples } from '../../lib/getExamples'

const props = defineProps({
  parameter: {
    type: Object,
    required: true,
  },
})

const examples = getExamples(props.parameter)

const constraints = getConstraints(props.parameter.schema)
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
      <OAMarkdown
        v-if="props.parameter.description"
        :content="props.parameter.description"
        class="text-sm text-gray-800 dark:text-gray-100"
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

      <div
        v-if="examples?.length === 1"
        class="flex flex-row space-x-2"
      >
        <span class="text-sm">{{ $t('Example') }}</span>
        <OACodeValue :value="examples[0]" />
      </div>
      <div
        v-if="examples?.length > 1"
        class="flex flex-row flex-wrap items-center gap-2"
      >
        <span class="text-sm">{{ $t('Examples') }}</span>
        <div
          v-for="(example, idx) in examples"
          :key="idx"
          class="flex flex-wrap gap-2"
        >
          <OACodeValue :value="example" />
        </div>
      </div>

      <template v-if="Object.keys(constraints).length > 0">
        <div
          v-for="(value, name) in constraints"
          :key="name"
          class="flex flex-row flex-wrap items-center gap-2"
        >
          <span class="text-sm">
            {{ name }}
          </span>
          <OACodeValue :value="value" />
        </div>
      </template>
    </div>
  </div>
</template>
