<script setup>
import { defineProps } from 'vue'

const { paths } = defineProps({
  paths: {
    type: Object,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'path-click',
])
</script>

<template>
  <div class="">
    <div class="grid grid-cols-[4rem,1fr] gap-2 overflow-auto">
      <span />
      <OAHeading level="h3" class="!mt-0">
        {{ $t('Operations') }}
      </OAHeading>
    </div>

    <template
      v-for="(path, idx) in Object.keys(paths)"
      :key="idx"
    >
      <a
        v-for="method in Object.keys(paths[path])"
        :key="`${path}-${method}`"
        class="grid grid-cols-[4rem,1fr] items-center gap-2 !text-foreground !no-underline cursor-pointer"
        @click="emit('path-click', `#${paths[path][method].operationId}`)"
      >
        <span :class="[`text-method-${method}`]" class="text-sm text-right">
          {{ method.toUpperCase() }}
        </span>
        <span
          :class="{
            'line-through': paths[path][method].deprecated,
          }"
        >
          {{ path }}
        </span>
      </a>
    </template>
  </div>
</template>
