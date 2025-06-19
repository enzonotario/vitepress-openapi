<script setup lang="ts">
import type { OASidebarItem } from '../../composables/useSidebar'
import type { ParsedOperation } from '../../types'
import { onMounted } from 'vue'
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

function addSidebarLinkEventListeners() {
  document
    .querySelectorAll<HTMLElement>('.OASidebarItem')
    .forEach((link: HTMLElement) => {
      const method = link.dataset.method
      const path = link.dataset.path

      if (!method || !path) {
        return
      }

      link.addEventListener('click', $event => handleSidebarLinkClick($event, method, path))
    })
}

function selectOperation(operation: ParsedOperation) {
  selectedOperation.value = operation
}

onMounted(() => {
  addSidebarLinkEventListeners()
})
</script>

<template>
  <VPSidebarGroup :items="sidebarItems" />
</template>
