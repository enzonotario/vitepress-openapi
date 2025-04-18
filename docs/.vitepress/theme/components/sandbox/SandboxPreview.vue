<script setup lang="ts">
import type { SandboxData } from '../../sandboxData'
import { useData } from 'vitepress'
import { getHeaders } from 'vitepress/dist/client/theme-default/composables/outline.js'
import { VPHomeContent } from 'vitepress/theme'
import { inject, onMounted, watch } from 'vue'
import { scrollToHash } from '../../../../../src/lib/utils'
import VPDocAsideOutline from '../vitepress/VPDocAsideOutline.vue'
import SandboxPreviewSidebar from './SandboxPreviewSidebar.vue'

const { theme } = useData()

const sandboxData = inject('sandboxData') as SandboxData

onMounted(() => {
  sandboxData.previewHeaders.value = getHeaders(theme.value.outline)
})

// Scroll into the operation when the operationId changes.
watch(sandboxData.operationId, () => {
  if (sandboxData.previewComponent.value === 'OAOperation') {
  } else if (sandboxData.previewComponent.value === 'OASpec') {
    scrollToHash({
      hash: `#${sandboxData.operationId.value}`,
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
  <div>
    <SandboxPreviewSidebar v-if="sandboxData.spec.value && sandboxData.showSidebar.value" />

    <div
      class="SandboxPreviewContentWrapper"
      :class="{
        'has-sidebar': sandboxData.showSidebar.value,
        'has-aside': sandboxData.showAside.value,
        'preview-full': false,
        'has-nav': !sandboxData.hideSandboxNav.value,
      }"
    >
      <div class="VPDoc">
        <VPHomeContent>
          <OAOperation
            v-if="sandboxData.previewComponent.value === 'OAOperation' && sandboxData.operationId.value"
            :key="sandboxData.operationId.value"
            :operation-id="sandboxData.operationId.value"
            :spec="sandboxData.spec.value"
            :spec-url="sandboxData.specUrl.value"
            @update:spec="sandboxData.spec.value = $event"
          />
          <OASpec
            v-else-if="sandboxData.previewComponent.value === 'OASpec'"
            :spec="sandboxData.spec.value"
            :spec-url="sandboxData.specUrl.value"
            @update:spec="sandboxData.spec.value = $event"
          />
          <OAIntroduction
            v-else-if="sandboxData.previewComponent.value === 'OAIntroduction'"
            :spec="sandboxData.spec.value"
            :spec-url="sandboxData.specUrl.value"
            @update:spec="sandboxData.spec.value = $event"
          />
        </VPHomeContent>
      </div>

      <div
        v-if="sandboxData.showAside.value"
        class="relative pl-[32px] max-w-[256px]"
      >
        <VPDocAsideOutline class="sticky top-0 pt-[32px] " />
      </div>
    </div>
  </div>
</template>

<style scoped>
.SandboxPreviewContentWrapper {
  padding-top: 16px;
  padding-bottom: 16px;
}
.SandboxPreviewContentWrapper.has-nav {
  padding-top: var(--vp-nav-height);
  padding-bottom: var(--vp-nav-height);
}
.SandboxPreviewContentWrapper.has-sidebar {
  padding-left: var(--vp-sidebar-width);
}
.SandboxPreviewContentWrapper.has-aside {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
