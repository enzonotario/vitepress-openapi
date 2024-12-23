<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { compressToURL, decompressFromURL } from '@amoutonbrady/lz-string'
import { useTheme } from 'vitepress-openapi'
import { useUrlSearchParams } from '@vueuse/core'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'
import type { SandboxData } from '../types'
import ThemeConfig from '../theme/ThemeConfig.vue'
import { deepUnref } from '../../../../../src/lib/deepUnref'
import Toaster from '../ui/toast/Toaster.vue'
import { useToast } from '../ui/toast/use-toast'
import SandboxPreview from './SandboxPreview.vue'
import SandboxNav from './SandboxNav.vue'
import SandboxEditor from './SandboxEditor.vue'
import SandboxRemoteFetch from './SandboxRemoteFetch.vue'
import { useData } from 'vitepress'

const { isDark, hash } = useData()

const queryParams = useUrlSearchParams('history')

const themeConfig = useTheme()

const { toast } = useToast()

const initialSpecUrl = (window && new URLSearchParams(location.search).get('specUrl')) || 'https://vitepress-openapi.vercel.app/openapi.json'

const sandboxDataQuery = new URLSearchParams(location.search).get('sandboxData')
const sandboxDataQueryDecompressed = sandboxDataQuery ? JSON.parse(decompressFromURL(sandboxDataQuery)) : null

const themeConfigQuery = new URLSearchParams(location.search).get('themeConfig')
if (themeConfigQuery) {
  useTheme(JSON.parse(decompressFromURL(themeConfigQuery)))
}

const sandboxData = {
  loading: ref(false),
  spec: ref(sandboxDataQueryDecompressed?.spec ?? {}),
  specUrl: ref(sandboxDataQueryDecompressed?.specUrl ?? initialSpecUrl),
  specLoaded: ref(sandboxDataQueryDecompressed?.spec && Object.keys(sandboxDataQueryDecompressed.spec).length > 0),
  previewComponent: ref(sandboxDataQueryDecompressed?.previewComponent ?? 'OASpec'),
  sandboxView: ref(sandboxDataQueryDecompressed?.sandboxView ?? 'edit'),
  showSidebar: ref(sandboxDataQueryDecompressed?.showSidebar ?? true),
  operationId: ref(sandboxDataQueryDecompressed?.operationId ?? null),
  themeConfig: ref(
    queryParams.themeConfig ? JSON.parse(decompressFromURL(queryParams.themeConfig)) : {},
  ),
} as SandboxData

provide('sandboxData', sandboxData)

function share() {
  const themeConfigQuery = compressToURL(JSON.stringify({
    ...themeConfig.getState(),
    theme: undefined,
    i18n: undefined,
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
  sandboxData.operationId.value = segments.length > 1 ? segments[1] : ''
})
</script>

<template>
  <div class="overflow-hidden">
    <SandboxNav class="fixed w-full top-0 z-[var(--vp-z-index-nav)] ">
      <template #start>
        <SandboxRemoteFetch />
        <ThemeConfig />
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

    <ResizablePanelGroup direction="horizontal" class="SandboxSplitView">
      <ResizablePanel v-show="sandboxData.sandboxView.value === 'edit'">
        <SandboxEditor />
      </ResizablePanel>

      <ResizableHandle v-if="sandboxData.sandboxView.value === 'edit'" with-handle class="z-40" />

      <ResizablePanel>
        <div class="SandboxPreviewPanel w-full h-full overflow-x-hidden overflow-y-auto">
          <SandboxPreview
            v-if="sandboxData.specLoaded.value"
            :spec-url="sandboxData.specUrl.value"
            :is-dark="isDark"
          />
          <OASpecSkeleton v-else />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>

    <Toaster />
  </div>
</template>

<style scoped>
.SandboxSplitView {
  margin-top: var(--vp-nav-height);
  height: calc(100vh - var(--vp-nav-height));
  max-height: calc(100vh - var(--vp-nav-height));
}
</style>
