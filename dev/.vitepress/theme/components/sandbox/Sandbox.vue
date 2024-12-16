<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue'
import { useSidebar } from 'vitepress-openapi'
import { scrollIntoOperationByOperationId } from '../../../../../src/lib/utils'
import SandboxPreview from './SandboxPreview.vue'
import SandboxNav from './SandboxNav.vue'

const loading = ref(false)

const specLoaded = ref(false)

const initialSpecUrl = (window && new URLSearchParams(location.search).get('specUrl')) || 'https://vitepress-openapi.vercel.app/openapi.json'

const url = ref(initialSpecUrl)

const specUrl = ref(initialSpecUrl)

const { isDark, theme, hash } = useData()

const operationId = computed(() => hash.value.split('#')[1])

const previewType = ref('spec')

onMounted(() => {
  theme.value.sidebar = []
})

function fetchSpec() {
  loading.value = true
  specLoaded.value = false
  specUrl.value = null
  nextTick(() => {
    specUrl.value = url.value
  })
}

function specUpdated(spec) {
  loading.value = false

  updateSidebar(spec)

  specLoaded.value = true
}

function updateSidebar(spec) {
  const sidebar = useSidebar({
    spec,
  })

  theme.value.sidebar = [
    ...sidebar.generateSidebarGroups({
      linkPrefix: '#',
    }),
  ]
}

function updateWindowLocation() {
  if (window && window.history) {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('specUrl', url.value)
    window.history.replaceState({}, '', `${location.pathname}?${searchParams}`)
  }
}

function share() {
  updateWindowLocation()

  navigator.clipboard.writeText(location.href)
}

watch(operationId, () => {
  if (previewType.value === 'oneOperation') {
  } else if (previewType.value === 'spec') {
    scrollIntoOperationByOperationId({
      hash: `#${operationId.value}`,
      offset: 120,
    })
  }
})
</script>

<template>
  <div>
    <SandboxNav class="fixed w-full top-0 z-[var(--vp-z-index-nav)]">
      <div class="flex flex-row items-center justify-center gap-4">
        <form @submit.prevent="fetchSpec">
          <input
            v-model="url"
            pattern="https?:\/\/.+"
            title="Please enter a valid HTTP/HTTPS URL"
            placeholder="Enter a spec URL"
            class="p-2 bg-muted rounded"
          >
          <button
            type="submit"
            :disabled="loading"
            class="p-2 bg-primary text-primary-foreground rounded disabled:cursor-not-allowed disabled:opacity-50"
          >
            Fetch
          </button>
        </form>

        <div class="flex flex-row items-center space-x-2">
          <label class="text-sm">Layout</label>

          <button
            :class="{ 'bg-primary text-primary-foreground': previewType === 'oneOperation' }"
            class="p-1 text-sm bg-muted rounded"
            @click="previewType = 'oneOperation'"
          >
            One Operation
          </button>
          <button
            :class="{ 'bg-primary text-primary-foreground': previewType === 'spec' }"
            class="p-1 text-sm bg-muted rounded"
            @click="previewType = 'spec'"
          >
            All Operations
          </button>
        </div>
      </div>

      <template #end>
        <button
          class="p-2 bg-muted rounded"
          @click="share"
        >
          Share
        </button>
      </template>
    </SandboxNav>

    <VPSidebar v-if="specLoaded" open />

    <div class="SandboxPreviewWrapper pl-[var(--vp-sidebar-width)] pt-[var(--vp-nav-height)]">
      <SandboxPreview
        v-if="specUrl"
        :spec-url="specUrl"
        :operation-id="operationId"
        :preview-type="previewType"
        :is-dark="isDark"
        @update:spec="specUpdated"
      />
    </div>
  </div>
</template>

<style>
body {
  height: 100vh;
  overflow-y: auto !important;
}

@media (min-width: 1440px) {
  .SandboxPreviewWrapper {
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2);
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
  }
}
</style>
