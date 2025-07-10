<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { defineProps } from 'vue'
import OAHeading from '../Common/OAHeading.vue'

const { paths } = defineProps({
  paths: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'pathClick',
])

const { t } = useI18n()
</script>

<template>
  <div class="bg-muted rounded border divide-y divide-[var(--vp-c-divider)]">
    <div class="p-2 pl-4">
      <OAHeading level="h3" class="!mt-0 !text-sm">
        {{ t('Operations') }}
      </OAHeading>
    </div>

    <div class="py-2">
      <template
        v-for="(path, idx) in Object.keys(paths)"
        :key="idx"
      >
        <a
          v-for="method in Object.keys(paths[path])"
          :key="`${path}-${method}`"
          class="grid grid-cols-[4rem,1fr] items-center gap-2 !text-foreground !no-underline cursor-pointer"
          :aria-label="`${method.toUpperCase()} ${path}`"
          :title="`${method.toUpperCase()} ${path}`"
          @click="emit('pathClick', `#${paths[path][method].operationId}`)"
        >
          <span :class="[`text-method-${method}`]" class="text-sm text-right">
            {{ method.toUpperCase() }}
          </span>
          <span
            :class="{
              'line-through': paths[path][method].deprecated,
            }"
            class="truncate hover:underline"
          >
            {{ path }}
          </span>
        </a>
      </template>
    </div>
  </div>
</template>
