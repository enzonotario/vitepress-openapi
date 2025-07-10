<script setup lang="ts">
import type { SandboxData } from '../../sandboxData'
import { DEFAULT_OPERATION_SLOTS, useTheme } from 'vitepress-openapi/client'
import { inject } from 'vue'

const sandboxData = inject('sandboxData') as SandboxData

const themeConfig = useTheme()

const availablePagesTypes = [
  'PagesByOperation',
  'PagesBySpec',
  'PagesByTag',
  'Introduction',
]

const availableSidebarItemsTypes = [
  'default',
  'itemsByTags',
  'itemsByPaths',
] as const

const requestBodyViews = ['schema', 'contentType']
const jsonViewerRenderers = ['vue-json-pretty', 'shiki']
const responseCodeSelectors = ['select', 'tabs']
const playgroundModes = ['text', 'tree', 'table']
const operationBadges = ['deprecated', 'operationId']
</script>

<template>
  <div
    class="flex flex-col gap-4 p-2 overflow-y-auto"
  >
    <div class="flex flex-wrap gap-2 justify-between">
      <div class="flex flex-col gap-2">
        <h3>VitePress</h3>
        <div class="flex flex-wrap items-start gap-4">
          <label for="showSidebar" class="flex items-center gap-2">
            <input
              id="showSidebar"
              type="checkbox"
              :checked="sandboxData.showSidebar.value"
              @change="sandboxData.showSidebar.value = ($event.target as any).checked"
            >
            Show sidebar
          </label>

          <label for="showAside" class="flex items-center gap-2">
            <input
              id="showAside"
              type="checkbox"
              :checked="sandboxData.showAside.value"
              @change="sandboxData.showAside.value = ($event.target as any).checked"
            >
            Show aside
          </label>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h3>i18n</h3>
        <div class="flex flex-wrap gap-2">
          <OALocaleSelect />
        </div>
      </div>
    </div>

    <div
      v-if="sandboxData.showSidebar.value"
      class="flex flex-col gap-2"
    >
      <h3>Sidebar</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4">
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
            class="bg-[--vp-input-bg-color] rounded p-2"
            min="1"
            max="6"
            :value="sandboxData.sidebarItemsDepth.value"
            @input="sandboxData.sidebarItemsDepth.value = ($event.target as any).value"
          >
        </label>
        <label v-if="sandboxData.sidebarItemsType.value === 'itemsByPaths'" for="collapsible" class="flex items-center gap-2">
          <input
            id="collapsible"
            type="checkbox"
            :checked="sandboxData.sidebarItemsCollapsible.value"
            @change="sandboxData.sidebarItemsCollapsible.value = ($event.target as any).checked"
          >
          Collapsible
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h3>Pages</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4">
        <label
          v-for="component in availablePagesTypes"
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
      v-if="sandboxData.previewComponent.value === 'PagesBySpec'"
      class="flex flex-col gap-2"
    >
      <h3>Spec</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 items-start gap-x-4">
        <label for="groupByTags" class="flex items-center gap-2">
          <input
            id="groupByTags"
            type="checkbox"
            :checked="themeConfig.getSpecConfig().groupByTags.value"
            @change="themeConfig.setSpecConfig({ groupByTags: ($event.target as any).checked })"
          >
          Group by tags
        </label>

        <div class="flex flex-col">
          <label for="collapsePaths" class="flex items-center gap-2">
            <input
              id="collapsePaths"
              type="checkbox"
              :checked="themeConfig.getSpecConfig().collapsePaths.value"
              @change="themeConfig.setSpecConfig({ collapsePaths: ($event.target as any).checked })"
            >
            Collapse paths
          </label>
          <small class="text-muted-foreground">
            Toggle `Group by tags` to see the effect
          </small>
        </div>

        <label for="showPathsSummary" class="flex items-center gap-2">
          <input
            id="showPathsSummary"
            type="checkbox"
            :checked="themeConfig.getSpecConfig().showPathsSummary.value"
            @change="themeConfig.setSpecConfig({ showPathsSummary: ($event.target as any).checked })"
          >
          Show paths summary
        </label>

        <label for="avoidCirculars" class="flex items-center gap-2">
          <input
            id="avoidCirculars"
            type="checkbox"
            :checked="themeConfig.getSpecConfig().avoidCirculars.value"
            @change="themeConfig.setSpecConfig({ avoidCirculars: ($event.target as any).checked })"
          >
          Avoid circulars
        </label>

        <label for="lazyRendering" class="flex items-center gap-2">
          <input
            id="lazyRendering"
            type="checkbox"
            :checked="themeConfig.getSpecConfig().lazyRendering.value"
            @change="themeConfig.setSpecConfig({ lazyRendering: ($event.target as any).checked })"
          >
          Lazy rendering
        </label>

        <label for="wrapExamples" class="flex items-center gap-2">
          <input
            id="wrapExamples"
            type="checkbox"
            :checked="themeConfig.getWrapExamples()"
            @change="themeConfig.setSpecConfig({ wrapExamples: ($event.target as any).checked })"
          >
          Wrap examples
        </label>

        <label for="disableDownload" class="flex items-center gap-2">
          <input
            id="disableDownload"
            type="checkbox"
            :checked="themeConfig.getSpecDisableDownload()"
            @change="themeConfig.setSpecConfig({ disableDownload: ($event.target as any).checked })"
          >
          Disable download
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h3>Request Body</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4">
        <label v-for="view in requestBodyViews" :key="view" class="flex items-center gap-2">
          <input
            type="radio"
            :checked="themeConfig.getRequestBodyDefaultView() === view"
            @change="themeConfig.setRequestBodyDefaultView(view as any)"
          >
          {{ view }}
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h3>JSON Viewer</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4">
        <div class="inline-flex flex-wrap gap-2">
          <label v-for="renderer in jsonViewerRenderers" :key="renderer" class="flex items-center gap-2">
            <input
              type="radio"
              :checked="themeConfig.getJsonViewerRenderer() === renderer"
              @change="themeConfig.setJsonViewerRenderer(renderer as any)"
            >
            {{ renderer }}
          </label>
        </div>
        <label for="jsonViewerDeep" class="flex items-center gap-2">
          <span>Depth</span>
          <input
            id="jsonViewerDeep"
            type="number"
            class="bg-[--vp-input-bg-color] rounded p-2"
            min="1"
            :value="themeConfig.getJsonViewerDeep()"
            @input="themeConfig.setJsonViewerDeep(Number(($event.target as any).value))"
          >
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h3>Schema Viewer</h3>
      <div class="flex flex-wrap gap-2">
        <label for="schemaViewerDeep" class="flex items-center gap-2">
          <span>Depth</span>
          <input
            id="schemaViewerDeep"
            type="number"
            class="bg-[--vp-input-bg-color] rounded p-2"
            min="1"
            :value="themeConfig.getSchemaViewerDeep()"
            @input="themeConfig.setSchemaViewerDeep(Number(($event.target as any).value))"
          >
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h3>Response</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4">
        <label v-for="type in responseCodeSelectors" :key="type" class="flex items-center gap-2">
          <input
            type="radio"
            :checked="themeConfig.getResponseCodeSelector() === type"
            @change="themeConfig.setResponseCodeSelector(type as any)"
          >
          {{ type }}
        </label>
        <label v-if="themeConfig.getResponseCodeSelector() === 'tabs'" for="responseMaxTabs" class="flex items-center gap-2">
          <span>Max tabs</span>
          <input
            id="responseMaxTabs"
            type="number"
            class="bg-[--vp-input-bg-color] rounded p-2"
            min="1"
            :value="themeConfig.getResponseCodeMaxTabs()"
            @input="themeConfig.setResponseCodeMaxTabs(Number(($event.target as any).value))"
          >
        </label>
      </div>

      <div class="flex flex-col gap-1">
        <span>Body view</span>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4">
          <label v-for="view in requestBodyViews" :key="`resp-${view}`" class="flex items-center gap-2">
            <input
              type="radio"
              :checked="themeConfig.getResponseBodyDefaultView() === view"
              @change="themeConfig.setResponseBodyDefaultView(view as any)"
            >
            {{ view }}
          </label>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h3>Playground</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4">
        <label v-for="mode in playgroundModes" :key="mode" class="flex items-center gap-2">
          <input
            type="radio"
            :checked="themeConfig.getPlaygroundJsonEditorMode() === mode"
            @change="themeConfig.setPlaygroundJsonEditorMode(mode as any)"
          >
          {{ mode }}
        </label>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4">
        <label for="playgroundMainMenuBar" class="flex items-center gap-2">
          <input
            id="playgroundMainMenuBar"
            type="checkbox"
            :checked="themeConfig.getPlaygroundJsonEditorMainMenuBar()"
            @change="themeConfig.setPlaygroundJsonEditorMainMenuBar(($event.target as any).checked)"
          >
          Main menu bar
        </label>
        <label for="playgroundNavigationBar" class="flex items-center gap-2">
          <input
            id="playgroundNavigationBar"
            type="checkbox"
            :checked="themeConfig.getPlaygroundJsonEditorNavigationBar()"
            @change="themeConfig.setPlaygroundJsonEditorNavigationBar(($event.target as any).checked)"
          >
          Navigation bar
        </label>
        <label for="playgroundStatusBar" class="flex items-center gap-2">
          <input
            id="playgroundStatusBar"
            type="checkbox"
            :checked="themeConfig.getPlaygroundJsonEditorStatusBar()"
            @change="themeConfig.setPlaygroundJsonEditorStatusBar(($event.target as any).checked)"
          >
          Status bar
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h3>Security</h3>
      <div class="flex flex-wrap gap-2">
        <label class="flex items-center gap-2">
          <span>Default scheme</span>
          <input
            type="text"
            class="bg-[--vp-input-bg-color] rounded p-2"
            :value="themeConfig.getSecurityDefaultScheme() || ''"
            @input="themeConfig.setSecurityDefaultScheme(($event.target as any).value || null)"
          >
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <h3>Server</h3>
      <div class="flex flex-wrap gap-2">
        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            :checked="themeConfig.getServerAllowCustomServer()"
            @change="themeConfig.setServerConfig({ allowCustomServer: ($event.target as any).checked })"
          >
          Allow custom server
        </label>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h3>Operation</h3>
      <div class="flex flex-col gap-2">
        <div class="flex flex-col gap-2">
          <h5>Operation Columns</h5>
          <div class="flex flex-wrap gap-x-4">
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
          <h5>Hidden Slots</h5>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4">
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

        <div class="flex flex-col gap-2">
          <h5>Badges</h5>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4">
            <label v-for="badge in operationBadges" :key="badge" class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="themeConfig.getOperationBadges().includes(badge)"
                @change="themeConfig.getOperationBadges().includes(badge) ? themeConfig.setOperationBadges(themeConfig.getOperationBadges().filter(b => b !== badge)) : themeConfig.setOperationBadges([...themeConfig.getOperationBadges(), badge])"
              >
              {{ badge }}
            </label>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h5>Path</h5>
          <div class="flex flex-col gap-2">
            <label for="showBaseUrl" class="flex items-center gap-2">
              <input
                id="showBaseUrl"
                type="checkbox"
                :checked="themeConfig.getShowBaseURL()"
                @change="themeConfig.setShowBaseURL(($event.target as any).checked)"
              >
              Show base URL
            </label>
            <label for="defaultBaseUrl" class="flex items-center gap-2">
              <span>Default URL</span>
              <input
                id="defaultBaseUrl"
                type="text"
                class="bg-[--vp-input-bg-color] rounded p-2"
                :value="themeConfig.getOperationDefaultBaseUrl()"
                @input="themeConfig.setOperationDefaultBaseUrl(($event.target as any).value)"
              >
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
