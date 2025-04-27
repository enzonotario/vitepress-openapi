<script setup lang="ts">
import { compressToURL } from '@amoutonbrady/lz-string'
import { ExternalLink } from 'lucide-vue-next'
import { deepUnref } from '../../../../../src/lib/deepUnref'
import { cn } from '../../../../../src/lib/utils'
import { initSandboxData } from '../../sandboxData'
import BrowserWindow from '../BrowserWindow.vue'

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
})

const sandboxData = initSandboxData({
  ...props.sandboxData,
})

const themeConfigCompressed = compressToURL(
  JSON.stringify({
    ...props.themeConfig,
  }),
)

const data = {
  ...deepUnref(sandboxData),
  loading: undefined,
  specLoaded: undefined,
  themeConfig: undefined,
}

const sandboxDataCompressed = compressToURL(
  JSON.stringify({
    ...data,
    hideSandboxNav: true,
  }),
)

const openSandboxDataCompressed = compressToURL(
  JSON.stringify({
    ...data,
    sandboxView: 'edit',
    hideSandboxNav: false,
  }),
)

const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://vitepress-openapi.vercel.app/sandbox/'
  : 'http://localhost:5173/sandbox/'

const url = `${baseUrl}?themeConfig=${themeConfigCompressed}&sandboxData=${sandboxDataCompressed}`

const openSandboxUrl = `${baseUrl}?themeConfig=${themeConfigCompressed}&sandboxData=${openSandboxDataCompressed}`
</script>

<template>
  <BrowserWindow>
    <template #title-end>
      <a
        :href="openSandboxUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="!no-underline"
      >
        <button class="text-muted-foreground flex items-center gap-2 hover:text-primary">
          <ExternalLink class="w-4 h-4" />
          <span>Open in Sandbox</span>
        </button>
      </a>
    </template>

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

      <div v-if="props.nonInteractive" class="absolute inset-0" />
    </div>
  </BrowserWindow>
</template>
