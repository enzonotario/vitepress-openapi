<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import OAHeading from '../Common/OAHeading.vue'

const props = defineProps({
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
  <div class="bg-muted rounded border divide-y divide-[var(--vp-c-divider)] overflow-hidden">
    <div class="px-4 py-2">
      <OAHeading level="h3" class="!mt-0 !text-sm font-semibold text-[var(--vp-c-text-1)]">
        {{ t('Operations') }}
      </OAHeading>
    </div>

    <div class="py-1">
      <template
        v-for="(path, idx) in Object.keys(props.paths)"
        :key="idx"
      >
        <a
          v-for="method in Object.keys(props.paths[path])"
          :key="`${path}-${method}`"
          class="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)] items-center gap-x-3 px-4 !text-foreground !no-underline cursor-pointer"
          :aria-label="`${method.toUpperCase()} ${path}`"
          :title="`${method.toUpperCase()} ${path}`"
          @click="emit('pathClick', `#${props.paths[path][method].operationId}`)"
        >
          <span :class="[`text-method-${method}`]" class="text-sm text-right">
            {{ method.toUpperCase() }}
          </span>
          <span
            :class="{
              'line-through': props.paths[path][method].deprecated,
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
