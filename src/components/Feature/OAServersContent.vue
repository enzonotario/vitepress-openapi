<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import OAHeading from '../Common/OAHeading.vue'

const props = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
})

const servers = props.openapi.spec.servers ?? []
const { t } = useI18n()
</script>

<template>
  <div>
    <OAHeading level="h2">
      {{ t('Servers') }}
    </OAHeading>

    <div class="flex flex-col space-y-4">
      <div v-for="server in servers" :key="server.url" class="flex flex-col p-3 gap-2 rounded bg-muted">
        <span class="font-semibold select-all">
          {{ server.url }}
        </span>

        <span v-if="server.description" class="text-muted-foreground">
          {{ server.description }}
        </span>
      </div>
    </div>
  </div>
</template>
