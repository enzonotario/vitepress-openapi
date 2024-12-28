<script setup lang="ts">
import { compressToURL } from '@amoutonbrady/lz-string'
import { initSandboxData } from '../../sandboxData'
import { deepUnref } from '../../../../../src/lib/deepUnref'
import { cn } from '../../../../../src/lib/utils'

const props = defineProps({
  themeConfig: {
    type: Object,
  },
  sandboxData: {
    type: Object,
  },
  nonInteractive: {
    type: Boolean,
    default: false,
  },
  iframeClass: {
    type: String,
    default: '',
  },
  iframeZoom: {
    type: Number,
    default: 1,
  },
  browserWindow: {
    type: Boolean,
    default: true,
  },
})

const sandboxData = initSandboxData({
  ...props.sandboxData,
})

const themeConfigCompressed = compressToURL(
  JSON.stringify({
    ...props.themeConfig,
  }),
)

const sandboxDataCompressed = compressToURL(
  JSON.stringify({
    ...deepUnref(sandboxData),
    loading: undefined,
    specLoaded: undefined,
    themeConfig: undefined,
    hideSandboxNav: true,
  }),
)

const baseUrl = import.meta.env.NODE_ENV === 'production'
  ? 'https://vitepress-openapi.vercel.app/sandbox/'
  : 'http://localhost:5173/sandbox/'

const url = `${baseUrl}?themeConfig=${themeConfigCompressed}&sandboxData=${sandboxDataCompressed}`
</script>

<template>
  <div
    class="rounded border overflow-hidden"
    :class="{
      'shadow-lg': props.browserWindow,
    }"
  >
    <div
      v-if="props.browserWindow"
      class="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <span class="w-3 h-3 bg-red-500 rounded-full" />
      <span class="w-3 h-3 bg-yellow-500 rounded-full" />
      <span class="w-3 h-3 bg-green-500 rounded-full" />
    </div>

    <div class="relative w-full h-full overflow-x-hidden">
      <iframe
        :class="cn([
          'w-full h-full rounded',
          {
            'pointer-events-none': props.nonInteractive,
          },
        ], props.iframeClass)"
        :src="url"
        frameborder="0"
        allowfullscreen
        :style="{ zoom: props.iframeZoom ?? 1 }"
      />

      <div
        v-if="props.nonInteractive"
        class="absolute inset-0 flex flex-col justify-center items-start rounded-b opacity-0 hover:opacity-100 bg-gray-800/50 transition-opacity"
      >
        <a
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
          class="ml-4"
        >
          <button class="p-2 bg-primary text-primary-foreground rounded">
            Open in Sandbox
          </button>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos adicionales si los necesitas */
</style>
