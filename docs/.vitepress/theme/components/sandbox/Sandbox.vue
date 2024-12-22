<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import { scrollIntoOperationByOperationId } from '../../../../../src/lib/utils'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'
import type { SandboxData } from '../types'
import SandboxPreview from './SandboxPreview.vue'
import SandboxNav from './SandboxNav.vue'
import SandboxEditor from './SandboxEditor.vue'
import { useData } from 'vitepress'

const { isDark, hash } = useData()

const initialSpecUrl = (window && new URLSearchParams(location.search).get('specUrl')) || 'https://vitepress-openapi.vercel.app/openapi.json'

const url = ref(initialSpecUrl)

const sandboxData = {
  loading: ref(false),
  spec: ref({}),
  specUrl: ref(initialSpecUrl),
  specLoaded: ref(false),
  previewType: ref('spec'),
} as SandboxData

provide('sandboxData', sandboxData)

const operationId = computed(() => {
  const segments = hash.value.split('#')
  return segments.length > 1 ? segments[1] : ''
})

function specUpdated(spec) {
  sandboxData.loading.value = false
  sandboxData.specLoaded.value = true
  sandboxData.spec.value = spec
}

function updateWindowLocation() {
  if (window && window.history) {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('specUrl', url.value)
    window.history.replaceState({}, '', `${location.pathname}?${searchParams}`)
  }
}

function share() {
  updateWindowLocation()

  navigator.clipboard.writeText(location.href)
}

watch(operationId, () => {
  if (sandboxData.previewType.value === 'oneOperation') {
  } else if (sandboxData.previewType.value === 'spec') {
    scrollIntoOperationByOperationId({
      hash: `#${operationId.value}`,
      offset: 120,
      container: document.querySelector('.SandboxPreviewPanel'),
    })
  }
})
</script>

<template>
  <div class="overflow-hidden">
    <SandboxNav class="fixed w-full top-0 z-[var(--vp-z-index-nav)] ">
      <template #end>
        <button class="p-2 bg-muted rounded" @click="share">
          Share
        </button>
      </template>
    </SandboxNav>

    <ResizablePanelGroup direction="horizontal" class="SandboxSplitView">
      <ResizablePanel>
        <SandboxEditor />
      </ResizablePanel>

      <ResizableHandle with-handle class="z-40" />

      <ResizablePanel>
        <div class="SandboxPreviewPanel w-full h-full overflow-x-hidden overflow-y-auto">
          <SandboxPreview
            v-if="sandboxData.specLoaded.value"
            :spec-url="sandboxData.specUrl.value"
            :operation-id="operationId"
            :is-dark="isDark"
            @update:spec="specUpdated"
          />
          <OASpecSkeleton v-else />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>

<style scoped>
.SandboxSplitView {
  margin-top: var(--vp-nav-height);
  height: calc(100vh - var(--vp-nav-height));
  max-height: calc(100vh - var(--vp-nav-height));
}
</style>
