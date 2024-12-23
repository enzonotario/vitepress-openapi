<script setup lang="ts">
import { VPHomeContent } from 'vitepress/theme'
import { inject, onBeforeMount, watch } from 'vue'
import { useSidebar } from 'vitepress-openapi'
import type { SandboxData } from '../types'
import { scrollIntoOperationByOperationId } from '../../../../../src/lib/utils'
import { useData } from 'vitepress'
import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue'

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

// Scroll into the operation when the operationId changes.
watch(sandboxData.operationId, () => {
  if (sandboxData.previewComponent.value === 'OAOperation') {
  } else if (sandboxData.previewComponent.value === 'OASpec') {
    scrollIntoOperationByOperationId({
      hash: `#${sandboxData.operationId.value}`,
      offset: 120,
      container: document.querySelector('.SandboxPreviewPanel'),
    })
  }
})

// Check if the operationId is still present in the spec.
watch(sandboxData.spec, (spec) => {
  if (sandboxData.operationId.value && spec.paths) {
    const operation = Object.values(spec.paths)
      .map(methods => Object.values(methods))
      .flat()
      .find(operation => operation.operationId === sandboxData.operationId.value)

    if (!operation) {
      sandboxData.operationId.value = null
    }
  }
})

// If the preview component is OAOperation and the operationId is not set, set it to the first operationId in the spec.
watch(sandboxData.previewComponent, () => {
  if (sandboxData.previewComponent.value === 'OAOperation'
    && !sandboxData.operationId.value) {
    const operationId = Object.entries(sandboxData.spec.value.paths)
      .map(([_, methods]) => {
        return Object.entries(methods).map(([_, operation]) => {
          return operation.operationId
        })
      })
      .flat()
      .filter(Boolean)[0]

    sandboxData.operationId.value = operationId
  }
})
</script>

<template>
  <div class="SandboxPreview">
    <div
      v-if="sandboxData.showSidebar.value"
      class="SandboxPreviewSidebar"
    >
      <VPSidebar open />
    </div>

    <div
      class="SandboxPreviewContentWrapper"
      :class="{
        'has-sidebar': sandboxData.showSidebar.value,
        'preview-full': false,
      }"
    >
      <VPHomeContent>
        <OAOperation
          v-if="sandboxData.previewComponent.value === 'OAOperation' && sandboxData.operationId.value"
          :key="sandboxData.operationId.value"
          :operation-id="sandboxData.operationId.value"
          :spec="sandboxData.spec.value"
          :is-dark="isDark"
        />
        <OASpec
          v-else-if="sandboxData.previewComponent.value === 'OASpec'"
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
  padding-bottom: var(--vp-nav-height);
}
/*@media (min-width: 1440px) {
  .preview-full.SandboxPreviewContentWrapper {
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2);
  }
}*/
.SandboxPreviewContentWrapper.has-sidebar {
  padding-left: var(--vp-sidebar-width);
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
