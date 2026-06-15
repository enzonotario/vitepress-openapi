<script setup lang="ts">
import type { DefaultTheme } from 'vitepress'
import type { OASidebarItem } from '../../composables/useSidebar'
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { useSidebar } from '../../composables/useSidebar'
import { useTheme } from '../../composables/useTheme'
import { resolvePlaygroundSidebar } from '../../lib/playground/resolvePlaygroundSidebar'
// @ts-expect-error: vitepress does not have types.
import VPSidebarGroup from './VPSidebarGroup'

const props = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
})

const sidebar = useSidebar({
  spec: props.openapi.getSpec(),
})

const themeConfig = useTheme()
const route = useRoute()
const { theme } = useData()

const sidebarItems = computed(() => {
  const configuredSidebar = themeConfig.getPlaygroundSidebar()
    ?? resolvePlaygroundSidebar(
      (theme.value as { playgroundSidebar?: DefaultTheme.Sidebar }).playgroundSidebar,
      route.path,
    )

  return (configuredSidebar
    ?? sidebar.generateSidebarGroups({
      linkPrefix: '#',
    })) as OASidebarItem[]
})
</script>

<template>
  <VPSidebarGroup :items="sidebarItems" />
</template>
