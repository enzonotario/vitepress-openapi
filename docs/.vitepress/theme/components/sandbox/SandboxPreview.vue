<script setup lang="ts">
import { VPHomeContent } from 'vitepress/theme'
import { inject, onBeforeMount } from 'vue'
import { useSidebar } from 'vitepress-openapi'
import type { SandboxData } from '../types'
import { useData } from 'vitepress'
import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue'

const props = defineProps({
  specUrl: {
    type: String,
    required: true,
  },
  operationId: {
    type: String,
    required: true,
  },
})

const { isDark, theme } = useData()

const sandboxData = inject('sandboxData') as SandboxData

onBeforeMount(() => {
  updateSidebar(sandboxData.spec.value)
})

function updateSidebar(spec) {
  const sidebar = useSidebar({
    spec,
  })

  theme.value.sidebar = [
    ...sidebar.generateSidebarGroups({
      linkPrefix: '#',
    }),
  ]
}
</script>

<template>
  <div class="SandboxPreview">
    <div class="SandboxPreviewSidebar">
      <VPSidebar open />
    </div>

    <div
      class="SandboxPreviewContentWrapper"
      :class="{
        'preview-full': false,
      }"
    >
      <VPHomeContent>
        <OAOperation
          v-if="sandboxData.previewType.value === 'oneOperation'"
          :key="props.operationId"
          :operation-id="props.operationId"
          :spec="sandboxData.spec.value"
          :is-dark="isDark"
        />
        <OASpec
          v-else-if="sandboxData.previewType.value === 'spec'"
          :spec="sandboxData.spec.value"
          :is-dark="isDark"
        />
      </VPHomeContent>
    </div>
  </div>
</template>

<style scoped>
.SandboxPreview {
}

.SandboxPreviewContentWrapper {
  padding-top: var(--vp-nav-height);
  padding-left: var(--vp-sidebar-width);
  padding-bottom: var(--vp-nav-height);
}
@media (min-width: 1440px) {
  .preview-full.SandboxPreviewContentWrapper {
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2);
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
  }
}

.SandboxPreview > .SandboxPreviewSidebar {
  position: absolute;
  width: var(--vp-sidebar-width);
  height: calc(100vh - var(--vp-nav-height));
  @apply bg-muted;
}

.SandboxPreview > .SandboxPreviewSidebar > .VPSidebar {
  position: sticky;
  width: var(--vp-sidebar-width);
  height: calc(100vh - var(--vp-nav-height));
  padding-top: calc(var(--vp-nav-height) * -1);
}
</style>
