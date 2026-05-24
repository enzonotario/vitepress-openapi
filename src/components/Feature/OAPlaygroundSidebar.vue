<script setup lang="ts">
import type { OASidebarItem } from '../../composables/useSidebar'
import { useSidebar } from '../../composables/useSidebar'
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

const sidebarItems: OASidebarItem[] = sidebar.generateSidebarGroups({
  linkPrefix: '#',
})
</script>

<template>
  <VPSidebarGroup :items="sidebarItems" />
</template>
