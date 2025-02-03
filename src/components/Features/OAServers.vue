<script setup>
import { inject } from 'vue'
import { getOpenApiInstance } from '../../lib/getOpenApiInstance.js'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
  },
  openapi: {
    type: Object,
    required: false,
  },
})

const openapi = props.openapi ?? getOpenApiInstance({
  custom: { spec: props.spec },
  injected: inject('openapi', undefined),
})

const servers = openapi.getServers()
</script>

<template>
  <div>
    <OAHeading level="h2">
      {{ $t('Servers') }}
    </OAHeading>

    <div class="flex flex-col space-y-4">
      <div v-for="server in servers" :key="server.url" class="flex flex-col p-3 gap-2 rounded bg-muted">
        <span class="font-semibold select-all">
          {{ server.url }}
        </span>

        <span v-if="server.description" class="text-gray-600 dark:text-gray-300">
          {{ server.description }}
        </span>
      </div>
    </div>
  </div>
</template>
