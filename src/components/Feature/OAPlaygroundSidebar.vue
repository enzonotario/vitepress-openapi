<script setup lang="ts">
import type { OASidebarItem } from '../../composables/useSidebar'
import type { ParsedOperation } from '../../types'
import { onMounted, onUnmounted } from 'vue'
import { useSidebar } from '../../composables/useSidebar'
import { usePlaygroundData } from '../../lib/playgroundData'
// @ts-expect-error: vitepress does not have types.
import VPSidebarGroup from './VPSidebarGroup'

const props = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
})

const { selectedOperation } = usePlaygroundData()

const sidebar = useSidebar({
  spec: props.openapi.getSpec(),
})

const sidebarItems: OASidebarItem[] = sidebar.generateSidebarGroups({
  linkPrefix: '#',
})

function handleSidebarLinkClick(event: MouseEvent, method: string, path: string) {
  event.preventDefault()

  const operation = props.openapi.getOperationByMethodAndPath(method, path)

  if (operation) {
    selectOperation(operation)
  }
}

const sidebarLinkEventHandlers = new Map<HTMLElement, (event: MouseEvent) => void>()

function addSidebarLinkEventListeners() {
  document
    .querySelectorAll<HTMLElement>('.OASidebarItem')
    .forEach((link: HTMLElement) => {
      const method = link.dataset.method
      const path = link.dataset.path

      if (!method || !path) {
        return
      }

      const handler = ($event: MouseEvent) => handleSidebarLinkClick($event, method, path)
      sidebarLinkEventHandlers.set(link, handler)
      link.addEventListener('click', handler)
    })
}

function removeSidebarLinkEventListeners() {
  sidebarLinkEventHandlers.forEach((handler, link) => {
    link.removeEventListener('click', handler)
  })
  sidebarLinkEventHandlers.clear()
}

function selectOperation(operation: ParsedOperation) {
  selectedOperation.value = operation
}

onMounted(() => {
  addSidebarLinkEventListeners()
})

onUnmounted(() => {
  removeSidebarLinkEventListeners()
})
</script>

<template>
  <VPSidebarGroup :items="sidebarItems" />
</template>
