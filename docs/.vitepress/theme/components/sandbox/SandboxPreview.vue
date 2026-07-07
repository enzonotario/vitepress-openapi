<script setup lang="ts">
import type { SandboxData } from '../../sandboxData'
import { useData } from 'vitepress'
import { getHeaders } from 'vitepress/dist/client/theme-default/composables/outline.js'
import { VPHomeContent } from 'vitepress/theme'
import { computed, inject, onMounted, watch } from 'vue'
import { scrollToHash } from '../../../../../src/lib/utils/utils'
import VPDocAsideOutline from '../vitepress/VPDocAsideOutline.vue'
import SandboxPreviewSidebar from './SandboxPreviewSidebar.vue'

const { theme } = useData()

const sandboxData = inject('sandboxData') as SandboxData

const isPlaygroundPreview = computed(() => sandboxData.previewComponent.value === 'Playground')
const showPreviewSidebar = computed(() => sandboxData.showSidebar.value)
const isEmbeddedPreview = computed(() => sandboxData.hideSandboxNav.value)

function getFirstOperationId(spec: Record<string, any>) {
  return Object.entries(spec.paths ?? {})
    .flatMap(([_, methods]) => Object.values(methods as Record<string, { operationId?: string }>))
    .map(operation => operation.operationId)
    .find(Boolean) ?? null
}

onMounted(() => {
  sandboxData.previewHeaders.value = getHeaders(theme.value.outline)
})

watch(sandboxData.operationId, () => {
  if (sandboxData.previewComponent.value === 'PagesBySpec') {
    scrollToHash({
      hash: `#${sandboxData.operationId.value}`,
    })
  }
})

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

watch(sandboxData.previewComponent, () => {
  if (sandboxData.previewComponent.value === 'PagesByOperation'
    && !sandboxData.operationId.value) {
    sandboxData.operationId.value = getFirstOperationId(sandboxData.spec.value)
  }
})

watch(sandboxData.previewComponent, () => {
  if (sandboxData.previewComponent.value === 'Playground'
    && !sandboxData.operationId.value) {
    sandboxData.operationId.value = getFirstOperationId(sandboxData.spec.value)
  }
})

watch(sandboxData.previewComponent, () => {
  if (sandboxData.previewComponent.value === 'PagesByTag'
    && (!sandboxData.tags.value || sandboxData.tags.value.length === 0)) {
    const tags = Object.entries(sandboxData.spec.value.paths)
      .map(([_, methods]) => {
        return Object.entries(methods).map(([_, operation]) => {
          return operation.tags
        })
      })
      .flat()
      .filter(Boolean)[0]

    sandboxData.tags.value = tags
  }
})
</script>

<template>
  <div
    class="SandboxPreviewRoot"
    :class="{
      'has-sidebar': showPreviewSidebar,
      'is-embedded': isEmbeddedPreview,
    }"
  >
    <SandboxPreviewSidebar v-if="sandboxData.spec.value && showPreviewSidebar" />

    <div
      class="SandboxPreviewContentWrapper"
      :class="{
        'has-sidebar': showPreviewSidebar,
        'has-aside': sandboxData.showAside.value,
        'has-playground': isPlaygroundPreview,
        'is-embedded': isEmbeddedPreview,
        'preview-full': false,
        'has-nav': !sandboxData.hideSandboxNav.value,
      }"
    >
      <div class="VPDoc">
        <VPHomeContent>
          <OAOperation
            v-if="sandboxData.previewComponent.value === 'PagesByOperation' && sandboxData.operationId.value"
            :key="sandboxData.operationId.value"
            :operation-id="sandboxData.operationId.value"
            :spec="sandboxData.spec.value"
            :spec-url="sandboxData.specUrl.value"
            @update:spec="sandboxData.spec.value = $event"
          />
          <OASpec
            v-else-if="sandboxData.previewComponent.value === 'PagesBySpec'"
            :spec="sandboxData.spec.value"
            :spec-url="sandboxData.specUrl.value"
            @update:spec="sandboxData.spec.value = $event"
          />
          <OASpec
            v-else-if="sandboxData.previewComponent.value === 'PagesByTag' && sandboxData.tags.value"
            :spec="sandboxData.spec.value"
            :spec-url="sandboxData.specUrl.value"
            :tags="sandboxData.tags.value"
            hide-info
            hide-servers
            @update:spec="sandboxData.spec.value = $event"
          />
          <OAIntroduction
            v-else-if="sandboxData.previewComponent.value === 'Introduction'"
            :spec="sandboxData.spec.value"
            :spec-url="sandboxData.specUrl.value"
            @update:spec="sandboxData.spec.value = $event"
          />
          <OASpecPlayground
            v-else-if="sandboxData.previewComponent.value === 'Playground'"
            :key="`${sandboxData.playgroundSidebarItemsType.value}-${sandboxData.playgroundSidebarUseCustomTemplate.value}`"
            :spec="sandboxData.spec.value"
            :spec-url="sandboxData.specUrl.value"
            :hide-branding="sandboxData.playgroundHideBranding.value"
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
.SandboxPreviewRoot {
  position: relative;
  min-height: inherit;
}
.SandboxPreviewContentWrapper {
  padding-top: 16px;
  padding-bottom: 16px;
}
.SandboxPreviewRoot.is-embedded {
  min-height: 0;
}
.SandboxPreviewContentWrapper.is-embedded {
  min-height: 0;
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
.SandboxPreviewContentWrapper.has-playground {
  padding-top: 0;
  padding-bottom: 0;
}
.SandboxPreviewContentWrapper.has-playground.has-nav {
  padding-top: var(--vp-nav-height);
  padding-bottom: 0;
  min-height: calc(100vh - var(--vp-nav-height));
}
</style>
