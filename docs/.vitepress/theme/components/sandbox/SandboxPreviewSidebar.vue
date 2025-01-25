<script setup lang="ts">
import type { SandboxData } from '../../sandboxData'
import { useData } from 'vitepress'
import { useSidebar } from 'vitepress-openapi'
import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue'
import { getHeaders } from 'vitepress/dist/client/theme-default/composables/outline.js'
import { inject, onBeforeMount, onMounted, ref, watch } from 'vue'

const { theme } = useData()

const sandboxData = inject('sandboxData') as SandboxData

const sidebarId = ref(0)

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
  sandboxData.sidebarItemsType,
  sandboxData.sidebarItemsDepth,
  sandboxData.sidebarItemsCollapsible,
], () => {
  updateSidebar(sandboxData.spec.value)

  sidebarId.value++
})
</script>

<template>
  <div
    class="SandboxPreviewSidebar"
    :class="{ 'has-nav': !sandboxData.hideSandboxNav.value }"
  >
    <VPSidebar :key="sidebarId" open />
  </div>
</template>

<style scoped>
.SandboxPreviewSidebar {
  position: absolute;
  width: var(--vp-sidebar-width);
  height: calc(100vh);
  @apply bg-muted;
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
.SandboxPreviewSidebar.has-nav > .VPSidebar {
  height: calc(100vh - var(--vp-nav-height));
  padding-top: calc(var(--vp-nav-height) * -1);
}
</style>
