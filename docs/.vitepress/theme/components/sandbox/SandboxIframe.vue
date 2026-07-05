<script setup lang="ts">
import { compressToURL } from '@amoutonbrady/lz-string'
import { ExternalLink } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref, useAttrs } from 'vue'
import { deepUnref } from '../../../../../src/lib/utils/deepUnref'
import { cn } from '../../../../../src/lib/utils/utils'
import { initSandboxData } from '../../sandboxData'
import BrowserWindow from '../BrowserWindow.vue'

defineOptions({
  inheritAttrs: false,
})

const TITLE_BAR_HEIGHT = 41

const attrs = useAttrs()

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
  autoHeight: {
    type: Boolean,
    default: false,
  },
})

const scale = computed(() => props.iframeZoom ?? 1)
const contentHeight = ref<number | null>(null)

const scaledFrameStyle = computed(() => {
  if (scale.value === 1) {
    return {
      width: '100%',
      height: contentHeight.value ? `${contentHeight.value}px` : '100%',
    }
  }

  const size = `${100 / scale.value}%`

  return {
    width: size,
    height: contentHeight.value ? `${contentHeight.value}px` : size,
    transform: `scale(${scale.value})`,
    transformOrigin: 'top left',
  }
})

const browserWindowStyle = computed(() => {
  if (!props.autoHeight || !contentHeight.value) {
    return undefined
  }

  const slotHeight = Math.ceil(contentHeight.value * scale.value)

  return {
    height: `${slotHeight + TITLE_BAR_HEIGHT}px`,
  }
})

const browserWindowClass = computed(() => {
  if (props.autoHeight) {
    return cn(!contentHeight.value && 'h-[70vh] max-h-[700px]')
  }

  return cn(attrs.class as string | undefined)
})

function handleResizeMessage(event: MessageEvent) {
  if (!props.autoHeight) {
    return
  }

  if (event.data?.type !== 'sandbox-iframe-resize') {
    return
  }

  if (typeof event.data.height !== 'number' || event.data.height <= 0) {
    return
  }

  contentHeight.value = event.data.height
}

onMounted(() => {
  window.addEventListener('message', handleResizeMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleResizeMessage)
})

const sandboxData = initSandboxData({
  ...props.sandboxData,
  autoHeight: props.autoHeight,
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
    autoHeight: props.autoHeight,
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
  <BrowserWindow :class-name="browserWindowClass" :style="browserWindowStyle">
    <template #title-end>
      <a
        :href="openSandboxUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="no-underline!"
      >
        <button class="text-muted-foreground flex items-center gap-2 hover:text-primary">
          <ExternalLink class="w-4 h-4" />
          <span>Open in Sandbox</span>
        </button>
      </a>
    </template>

    <div class="relative h-full w-full overflow-hidden">
      <div class="SandboxIframe-scaledFrame" :style="scaledFrameStyle">
        <iframe
          :class="cn([
            'block h-full w-full rounded',
            {
              'pointer-events-none': props.nonInteractive,
            },
          ], props.iframeClass)"
          :src="url"
          frameborder="0"
          allowfullscreen
        />
      </div>

      <div v-if="props.nonInteractive" class="absolute inset-0" />
    </div>
  </BrowserWindow>
</template>

<style scoped>
.SandboxIframe-scaledFrame {
  width: 100%;
  height: 100%;
}
</style>
