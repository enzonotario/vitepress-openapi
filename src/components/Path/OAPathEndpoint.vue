<script setup>
import { defineEmits } from 'vue'
import OAMethodBadge from '../Common/OAMethodBadge.vue'

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
  hideBaseUrl: {
    type: Boolean,
    default: false,
  },
  deprecated: {
    type: Boolean,
    default: false,
  },
  servers: {
    type: Array,
    required: false,
  },
})

const emits = defineEmits([
  'update:selectedServer',
])
</script>

<template>
  <div class="flex flex-col gap-2 text-sm bg-muted rounded p-2">
    <div class="flex flex-row items-center gap-4 overflow-x-auto">
      <OAMethodBadge :method="props.method" />
      <span class="flex flex-row flex-shrink-0 text-gray-600 dark:text-gray-400">
        <span
          v-if="!props.hideBaseUrl"
          class="hidden md:inline-block"
        >
          {{ props.baseUrl }}
        </span>
        <span
          :class="{
            'line-through': props.deprecated,
          }"
          class="text-gray-800 dark:text-gray-200 font-bold select-all"
        >{{ props.path }}</span>
      </span>
    </div>

    <div
      v-if="props.servers && props.servers.length > 1"
      class="flex flex-row items-center gap-2"
    >
      <span class="text-gray-600 dark:text-gray-400">
        {{ $t('Server') }}
      </span>
      <select
        :value="props.baseUrl"
        class="w-full rounded p-1 text-sm bg-white dark:bg-gray-800 dark:text-gray-200"
        @change="($event) => emits('update:selectedServer', $event.target.value)"
      >
        <option
          v-for="(server, idx) in props.servers"
          :key="`${server.url}-${idx}`"
          :value="server.url"
          :selected="server.url === props.baseUrl"
        >
          {{ server.url }}
        </option>
      </select>
    </div>
  </div>
</template>
