<script setup lang="ts">
import { useI18n } from '@byjohann/vue-i18n'
import { defineProps } from 'vue'
import { Badge } from '../ui/badge'
import OAPlaygroundResponseContent from './OAPlaygroundResponseContent.vue'

const { response, loading } = defineProps({
  response: {
    type: null,
    required: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
</script>

<template>
  <details v-if="response || loading" open>
    <summary class="!my-0 text-lg font-bold cursor-pointer">
      <div class="inline-flex items-center gap-2 w-[calc(100%-24px)]">
        <span>{{ loading ? t('Loading') : t('Response') }}</span>

        <span class="flex-1" />

        <Badge
          v-if="response && response.status"
          variant="plain"
          class="rounded py-1.5"
          :class="{
            'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100': String(response.status).startsWith('2'),
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100': String(response.status).startsWith('3'),
            'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100': String(response.status).startsWith('4') || String(response.status).startsWith('5'),
          }"
        >
          {{ response.status }}
        </Badge>
      </div>
    </summary>

    <div class="flex flex-col gap-2">
      <div v-if="response" class="text-sm text-muted-foreground">
        {{ t('Response time') }}: {{ loading ? t('Loading') : `${response.time}ms` }}
      </div>

      <div class="flex flex-col max-h-96 overflow-y-auto">
        <OAPlaygroundResponseContent v-if="response" :response="response" />
      </div>
    </div>
  </details>
</template>
