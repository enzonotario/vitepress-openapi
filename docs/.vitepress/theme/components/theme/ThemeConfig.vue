<script setup lang="ts">
import { useTheme } from 'vitepress-openapi'
import { inject } from 'vue'
import { DEFAULT_OPERATION_SLOTS } from '../../../../../src'
import type { SandboxData } from '../../sandboxData'

const sandboxData = inject('sandboxData') as SandboxData

const themeConfig = useTheme()

const availableComponents = [
  'OAOperation',
  'OASpec',
]

const availableSidebarItemsTypes = [
  'default',
  'itemsByTags',
  'itemsByPaths',
]
</script>

<template>
  <div
    class="flex flex-col gap-4 p-2 overflow-y-auto"
  >
    <div class="flex flex-col gap-2">
      <h3>VitePress</h3>
      <div class="grid grid-cols-3 items-start gap-4">
        <label for="showSidebar" class="flex items-center gap-2">
          <input
            id="showSidebar"
            type="checkbox"
            :checked="sandboxData.showSidebar.value"
            @change="sandboxData.showSidebar.value = $event.target.checked"
          >
          Show sidebar
        </label>

        <label for="showAside" class="flex items-center gap-2">
          <input
            id="showAside"
            type="checkbox"
            :checked="sandboxData.showAside.value"
            @change="sandboxData.showAside.value = $event.target.checked"
          >
          Show aside
        </label>
      </div>
    </div>

    <div
      v-if="sandboxData.showSidebar.value"
      class="flex flex-col gap-2"
    >
      <h3>Sidebar</h3>
      <div class="grid grid-cols-2 gap-2">
        <label
          v-for="type in availableSidebarItemsTypes"
          :key="type"
          class="flex items-center gap-2"
        >
          <input
            type="radio"
            :checked="sandboxData.sidebarItemsType.value === type"
            @change="sandboxData.sidebarItemsType.value = type"
          >
          {{ type }}
        </label>

        <label v-if="sandboxData.sidebarItemsType.value === 'itemsByPaths'" for="depth" class="flex items-center gap-2">
          <span>Depth</span>
          <input
            id="depth"
            type="number"
            min="1"
            max="6"
            :value="sandboxData.sidebarItemsDepth.value"
            @input="sandboxData.sidebarItemsDepth.value = $event.target.value"
          >
        </label>
        <label v-if="sandboxData.sidebarItemsType.value === 'itemsByPaths'" for="collapsible" class="flex items-center gap-2">
          <input
            id="collapsible"
            type="checkbox"
            :checked="sandboxData.sidebarItemsCollapsible.value"
            @change="sandboxData.sidebarItemsCollapsible.value = $event.target.checked"
          >
          Collapsible
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h3>i18n</h3>
      <div class="grid grid-cols-2 gap-2">
        <OALocaleSelect />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h3>Preview Component</h3>
      <div class="grid grid-cols-2 gap-2">
        <label
          v-for="component in availableComponents"
          :key="component"
          class="flex items-center gap-2"
        >
          <input
            type="radio"
            :checked="sandboxData.previewComponent.value === component"
            @change="sandboxData.previewComponent.value = component"
          >
          {{ component }}
        </label>
      </div>
    </div>

    <div
      v-if="sandboxData.previewComponent.value === 'OASpec'"
      class="flex flex-col gap-2"
    >
      <h3>Spec</h3>
      <div class="grid grid-cols-3 items-start gap-4">
        <label for="groupByTags" class="flex items-center gap-2">
          <input
            id="groupByTags"
            type="checkbox"
            :checked="themeConfig.getSpecConfig().groupByTags.value"
            @change="themeConfig.setSpecConfig({ groupByTags: $event.target.checked })"
          >
          Group by tags
        </label>

        <div class="flex flex-col">
          <label for="collapsePaths" class="flex items-center gap-2">
            <input
              id="collapsePaths"
              type="checkbox"
              :checked="themeConfig.getSpecConfig().collapsePaths.value"
              @change="themeConfig.setSpecConfig({ collapsePaths: $event.target.checked })"
            >
            Collapse paths
          </label>
          <small class="text-gray-500 dark:text-gray-400">
            Toggle `Group by tags` to see the effect
          </small>
        </div>

        <label for="showPathsSummary" class="flex items-center gap-2">
          <input
            id="showPathsSummary"
            type="checkbox"
            :checked="themeConfig.getSpecConfig().showPathsSummary.value"
            @change="themeConfig.setSpecConfig({ showPathsSummary: $event.target.checked })"
          >
          Show paths summary
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h3>Operation</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h5>Hidden Slots</h5>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="slot in DEFAULT_OPERATION_SLOTS" :key="slot" class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="themeConfig.getOperationHiddenSlots().includes(slot)"
                @change="themeConfig.getOperationHiddenSlots().includes(slot) ? themeConfig.getOperationHiddenSlots().splice(themeConfig.getOperationHiddenSlots().indexOf(slot), 1) : themeConfig.getOperationHiddenSlots().push(slot)"
              >
              {{ slot }}
            </label>
          </div>
        </div>

        <div>
          <h5>Operation Columns</h5>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="col in [1, 2]" :key="col" class="flex items-center gap-2">
              <input
                type="radio"
                :checked="themeConfig.getOperationCols() === col"
                @change="themeConfig.setOperationCols(col)"
              >
              {{ col }}
            </label>
          </div>
        </div>

        <div>
          <h5>Path</h5>
          <div class="grid grid-cols-2 gap-2">
            <label for="showBaseUrl" class="flex items-center gap-2">
              <input
                id="showBaseUrl"
                type="checkbox"
                :checked="themeConfig.getShowBaseURL()"
                @change="themeConfig.setShowBaseURL($event.target.checked)"
              >
              Show base URL
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h3 {
  @apply mt-0 font-semibold;
}
</style>
