<script setup lang="ts">
import { compressToURL, decompressFromURL } from '@amoutonbrady/lz-string'
import { useUrlSearchParams } from '@vueuse/core'
import { useData } from 'vitepress'
import { useTheme } from 'vitepress-openapi/client'
import { provide, watch, watchEffect, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { deepUnref } from '../../../../../src/lib/utils/deepUnref'
import { applyPlaygroundSandboxSidebar } from '../../lib/playgroundSandboxSidebar'
import { initSandboxData } from '../../sandboxData'
import ThemeConfigPopover from '../theme/ThemeConfigPopover.vue'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'
import Toaster from '../ui/toast/Toaster.vue'
import { useToast } from '../ui/toast/use-toast'
import SandboxEditor from './SandboxEditor.vue'
import SandboxNav from './SandboxNav.vue'
import SandboxPreview from './SandboxPreview.vue'
import SandboxRemoteFetch from './SandboxRemoteFetch.vue'

const { hash } = useData()

const queryParams = useUrlSearchParams('history')

const themeConfig = useTheme()

const { toast } = useToast()

const initialSpecUrl = new URLSearchParams(location.search).get('specUrl') || 'https://vitepress-openapi.vercel.app/openapi.json'

const sandboxDataQuery = new URLSearchParams(location.search).get('sandboxData')
const sandboxDataQueryDecompressed = sandboxDataQuery ? JSON.parse(decompressFromURL(sandboxDataQuery)) : null

const themeConfigQuery = new URLSearchParams(location.search).get('themeConfig')
if (themeConfigQuery) {
  useTheme(JSON.parse(decompressFromURL(themeConfigQuery)))
}

const sandboxData = initSandboxData({
  ...sandboxDataQueryDecompressed,
  specUrl: initialSpecUrl,
  themeConfig: queryParams.themeConfig ? JSON.parse(decompressFromURL(String(queryParams.themeConfig))) : {},
})

provide('sandboxData', sandboxData)

const isEmbeddedAutoHeight = computed(() => (
  sandboxData.hideSandboxNav.value && sandboxData.autoHeight.value
))

function share() {
  const themeConfigQuery = compressToURL(JSON.stringify({
    ...themeConfig.getState(),
    theme: undefined,
    i18n: undefined,
    highlighterTheme: undefined,
  }))

  const sandboxDataQuery = compressToURL(JSON.stringify({
    ...deepUnref(sandboxData),
    loading: undefined,
    specLoaded: undefined,
    themeConfig: undefined,
  }))

  const searchParams = new URLSearchParams(location.search)
  searchParams.set('themeConfig', themeConfigQuery)
  searchParams.set('sandboxData', sandboxDataQuery)
  window.history.replaceState({}, '', `${location.pathname}?${searchParams}`)

  navigator.clipboard.writeText(location.href)

  toast({
    title: 'Copied to clipboard',
  })
}

watch(hash, () => {
  const segments = hash.value.split('#')

  switch (sandboxData.previewComponent.value) {
    case 'PagesByOperation':
    case 'Playground':
      sandboxData.operationId.value = segments.length > 1 ? segments[1] : ''
      break
    case 'PagesByTag':
      sandboxData.tags.value = segments.length > 1 ? segments[1].split(',') : []
      break
  }
})

watchEffect(() => {
  applyPlaygroundSandboxSidebar(sandboxData, themeConfig)
})

watch(sandboxData.previewComponent, (component) => {
  if (component === 'Playground') {
    sandboxData.showSidebar.value = true
  }
}, { immediate: true })

let embeddedResizeObserver: ResizeObserver | undefined

function postEmbeddedHeight() {
  if (!isEmbeddedAutoHeight.value) {
    return
  }

  const target = document.querySelector('.SandboxPreviewRoot')
  if (!target) {
    return
  }

  window.parent.postMessage({
    type: 'sandbox-iframe-resize',
    height: Math.ceil(target.getBoundingClientRect().height),
  }, '*')
}

function setupEmbeddedResizeObserver() {
  if (!isEmbeddedAutoHeight.value) {
    return
  }

  embeddedResizeObserver?.disconnect()

  const target = document.querySelector('.SandboxPreviewRoot')
  if (!target) {
    return
  }

  embeddedResizeObserver = new ResizeObserver(() => {
    postEmbeddedHeight()
  })
  embeddedResizeObserver.observe(target)
  postEmbeddedHeight()
}

onMounted(() => {
  setupEmbeddedResizeObserver()
})

onUnmounted(() => {
  embeddedResizeObserver?.disconnect()
})

watch(() => sandboxData.specLoaded.value, (loaded) => {
  if (loaded) {
    nextTick(() => {
      setupEmbeddedResizeObserver()
    })
  }
})
</script>

<template>
  <div
    class="overflow-hidden"
    :class="{
      SandboxEmbeddedRoot: sandboxData.hideSandboxNav.value,
      'is-auto-height': isEmbeddedAutoHeight,
    }"
  >
    <SandboxNav v-show="!sandboxData.hideSandboxNav.value" class="fixed w-full top-0 z-(--vp-z-index-nav) ">
      <template #start>
        <SandboxRemoteFetch />
        <ThemeConfigPopover />
        <a class="VPLink link VPNavBarMenuLink hover:bg-muted p-2" href="/"><span>Docs</span></a>
      </template>

      <div class="flex flex-row justify-center items-center">
        <div class="grid grid-cols-2 w-44">
          <button
            :class="{ 'bg-muted': sandboxData.sandboxView.value === 'edit' }"
            class="p-2 hover:bg-muted rounded"
            @click="sandboxData.sandboxView.value = 'edit'"
          >
            Edit
          </button>
          <button
            :class="{ 'bg-muted': sandboxData.sandboxView.value === 'preview' }"
            class="p-2 hover:bg-muted rounded"
            @click="sandboxData.sandboxView.value = 'preview'"
          >
            Preview
          </button>
        </div>
      </div>
      <template #end>
        <button class="p-2 bg-muted rounded" @click="share">
          Share
        </button>
      </template>
    </SandboxNav>

    <ResizablePanelGroup
      direction="horizontal"
      class="SandboxSplitView"
      :class="{
        'has-nav': !sandboxData.hideSandboxNav.value,
        'is-embedded': sandboxData.hideSandboxNav.value,
        'is-auto-height': isEmbeddedAutoHeight,
      }"
    >
      <ResizablePanel v-show="sandboxData.sandboxView.value === 'edit'">
        <SandboxEditor />
      </ResizablePanel>

      <ResizableHandle v-if="sandboxData.sandboxView.value === 'edit'" with-handle class="z-40" />

      <ResizablePanel class="SandboxPreviewPanel">
        <div
          class="w-full h-full min-h-0 overflow-x-hidden"
          :class="isEmbeddedAutoHeight ? 'overflow-y-hidden' : 'overflow-y-auto'"
        >
          <SandboxPreview v-if="sandboxData.specLoaded.value" />
          <OASpecSkeleton v-else />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>

    <Toaster />
  </div>
</template>

<style scoped>
.SandboxSplitView {
  margin-top: 0;
  height: 100vh;
  max-height: 100vh;
}
.SandboxSplitView.is-embedded.is-auto-height {
  height: auto;
  max-height: none;
}
.SandboxSplitView.is-embedded:not(.is-auto-height) {
  height: 100%;
  max-height: none;
}
.SandboxSplitView.has-nav {
  margin-top: var(--vp-nav-height);
  height: calc(100vh - var(--vp-nav-height));
  max-height: calc(100vh - var(--vp-nav-height));
}
.SandboxPreviewPanel,
.SandboxPreviewPanel > div {
  min-height: 0;
}
.SandboxSplitView:not(.is-embedded) .SandboxPreviewPanel,
.SandboxSplitView:not(.is-embedded) .SandboxPreviewPanel > div {
  height: 100%;
}
.SandboxSplitView.is-embedded:not(.is-auto-height) .SandboxPreviewPanel,
.SandboxSplitView.is-embedded:not(.is-auto-height) .SandboxPreviewPanel > div {
  height: 100%;
}
:global(html:has(.SandboxEmbeddedRoot.is-auto-height)),
:global(body:has(.SandboxEmbeddedRoot.is-auto-height)),
:global(#app:has(.SandboxEmbeddedRoot.is-auto-height)) {
  min-height: 0 !important;
  height: auto !important;
  overflow: hidden;
}
:global(html:has(.SandboxEmbeddedRoot:not(.is-auto-height))),
:global(body:has(.SandboxEmbeddedRoot:not(.is-auto-height))),
:global(#app:has(.SandboxEmbeddedRoot:not(.is-auto-height))) {
  height: 100%;
  min-height: 0 !important;
  overflow: hidden;
}
.SandboxEmbeddedRoot.is-auto-height {
  height: auto;
}
.SandboxEmbeddedRoot:not(.is-auto-height) {
  position: fixed;
  inset: 0;
  width: 100%;
  overflow: hidden;
}
</style>
