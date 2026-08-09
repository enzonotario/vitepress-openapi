<script setup lang="ts">
import type { SandboxData } from '../../sandboxData'
import { useData } from 'vitepress'
import { useSidebar } from 'vitepress-openapi'
import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue'
import { getHeaders } from 'vitepress/dist/client/theme-default/composables/outline.js'
import { computed, inject, onBeforeMount, onMounted, ref, watch } from 'vue'
import { buildPlaygroundSandboxSidebar } from '../../lib/playgroundSandboxSidebar'

const { theme } = useData()

const sandboxData = inject('sandboxData') as SandboxData

const sidebarId = ref(0)

const isPlaygroundPreview = computed(() => sandboxData.previewComponent.value === 'Playground')

onBeforeMount(() => {
  updateSidebar(sandboxData.spec.value)
})

onMounted(() => {
  sandboxData.previewHeaders.value = getHeaders(theme.value.outline)
})

function updateSidebar(spec) {
  const sidebar = useSidebar({
    spec,
  })

  if (isPlaygroundPreview.value) {
    const groups = buildPlaygroundSandboxSidebar(spec, sandboxData)
      ?? sidebar.generateSidebarGroups({
        linkPrefix: '#',
      })

    theme.value.sidebar = [{
      text: 'Playground Example',
      items: groups,
    }]
    return
  }

  theme.value.sidebar = [
    ...(
      sandboxData.sidebarItemsType.value === 'itemsByPaths'
        ? sidebar.itemsByPaths({
            linkPrefix: '#',
            depth: sandboxData.sidebarItemsDepth.value,
            collapsible: sandboxData.sidebarItemsCollapsible.value,
          })
        : []
    ),

    ...(
      sandboxData.sidebarItemsType.value === 'itemsByTags'
        ? sidebar.itemsByTags({
            linkPrefix: '#',
          })
        : []
    ),

    ...(
      sandboxData.sidebarItemsType.value === 'default'
        ? sidebar.generateSidebarGroups({
            linkPrefix: '#',
          })
        : []
    ),
  ]
}

watch([
  sandboxData.previewComponent,
  sandboxData.sidebarItemsType,
  sandboxData.sidebarItemsDepth,
  sandboxData.sidebarItemsCollapsible,
  sandboxData.playgroundSidebarItemsType,
  sandboxData.playgroundSidebarUseCustomTemplate,
  sandboxData.playgroundSidebarItemsDepth,
  sandboxData.playgroundSidebarItemsCollapsible,
  sandboxData.spec,
], () => {
  updateSidebar(sandboxData.spec.value)

  sidebarId.value++
})
</script>

<template>
  <div
    class="SandboxPreviewSidebar"
    :class="{
      'has-nav': !sandboxData.hideSandboxNav.value,
      'is-embedded': sandboxData.hideSandboxNav.value,
    }"
  >
    <VPSidebar :key="sidebarId" open />
  </div>
</template>

<style scoped>
@reference "../../style.css";

.SandboxPreviewSidebar {
  position: absolute;
  top: 0;
  bottom: 0;
  width: var(--vp-sidebar-width);
  height: calc(100vh);
  @apply bg-muted;
}
.SandboxPreviewSidebar.is-embedded {
  height: auto;
}
.SandboxPreviewSidebar.has-nav {
  height: calc(100vh - var(--vp-nav-height));
}

.SandboxPreviewSidebar > .VPSidebar {
  position: sticky;
  width: var(--vp-sidebar-width);
  height: calc(100vh);
  padding-top: 0;
}
.SandboxPreviewSidebar.is-embedded > .VPSidebar {
  height: 100%;
}
.SandboxPreviewSidebar.has-nav > .VPSidebar {
  height: calc(100vh - var(--vp-nav-height));
  padding-top: calc(var(--vp-nav-height) * -1);
}
</style>
