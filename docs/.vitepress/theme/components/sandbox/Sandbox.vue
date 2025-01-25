<script setup lang="ts">
import { compressToURL, decompressFromURL } from '@amoutonbrady/lz-string'
import { useUrlSearchParams } from '@vueuse/core'
import { useData } from 'vitepress'
import { useTheme } from 'vitepress-openapi/client'
import { provide, watch } from 'vue'
import { deepUnref } from '../../../../../src/lib/deepUnref'
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
    <SandboxNav v-show="!sandboxData.hideSandboxNav.value" class="fixed w-full top-0 z-[var(--vp-z-index-nav)] ">
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
      :class="{ 'has-nav': !sandboxData.hideSandboxNav.value }"
    >
      <ResizablePanel v-show="sandboxData.sandboxView.value === 'edit'">
        <SandboxEditor />
      </ResizablePanel>

      <ResizableHandle v-if="sandboxData.sandboxView.value === 'edit'" with-handle class="z-40" />

      <ResizablePanel>
        <div class="w-full h-full overflow-x-hidden overflow-y-auto">
          <SandboxPreview
            v-if="sandboxData.specLoaded.value"
            :spec-url="sandboxData.specUrl.value"
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
  margin-top: 0;
  height: 100vh;
  max-height: 100vh;
}
.SandboxSplitView.has-nav {
  margin-top: var(--vp-nav-height);
  height: calc(100vh - var(--vp-nav-height));
  max-height: calc(100vh - var(--vp-nav-height));
}
</style>
