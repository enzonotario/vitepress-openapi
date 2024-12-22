<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'
import { inject, nextTick, onMounted, ref, watch, watchEffect } from 'vue'
import type { SandboxData } from '../types'
import { useData } from 'vitepress'

const { isDark } = useData()

const sandboxData = inject('sandboxData') as SandboxData

const innerValue = ref(JSON.stringify(sandboxData?.spec?.value, null, 2))

const innerUrl = ref(sandboxData?.specUrl?.value)

onMounted(() => {
  if (innerUrl.value) {
    fetchSpec()
  }
})

watchEffect(() => {
  innerValue.value = JSON.stringify(sandboxData?.spec?.value, null, 2)
})

watch(innerValue, () => {
  try {
    const parsed = JSON.parse(innerValue.value)

    sandboxData.specLoaded.value = false
    sandboxData.loading.value = false

    sandboxData.spec.value = parsed
  } catch (error) {
    console.warn('Invalid JSON')
  } finally {
    nextTick(() => {
      sandboxData.specLoaded.value = true
      sandboxData.loading.value = false
    })
  }
})

async function fetchSpec() {
  sandboxData.loading.value = true
  sandboxData.specLoaded.value = false
  sandboxData.specUrl.value = null

  try {
    const response = await fetch(innerUrl.value)
    const data = await response.json()

    sandboxData.spec.value = data
  } catch (error) {
    sandboxData.spec.value = {}
  } finally {
    await nextTick(() => {
      sandboxData.specUrl.value = innerUrl.value
      sandboxData.loading.value = false
      sandboxData.specLoaded.value = true
    })
  }
}
</script>

<template>
  <div class="SandboxEditor">
    <div class="SandboxEditorWrapper">
      <div class="w-full h-full flex flex-col">
        <div class="flex flex-row items-center justify-center gap-4 p-2">
          <form @submit.prevent="fetchSpec">
            <input
              v-model="innerUrl"
              pattern="https?:\/\/.+"
              title="Please enter a valid HTTP/HTTPS URL"
              placeholder="Enter a spec URL"
              class="p-2 bg-muted rounded"
            >
            <button
              type="submit"
              :disabled="sandboxData.loading.value"
              class="p-2 bg-primary text-primary-foreground rounded disabled:cursor-not-allowed disabled:opacity-50"
            >
              Fetch
            </button>
          </form>

          <div class="flex flex-row items-center space-x-2">
            <label class="text-sm">Layout</label>

            <button
              :class="{ 'bg-primary text-primary-foreground': sandboxData.previewType.value === 'oneOperation' }"
              class="p-1 text-sm bg-muted rounded"
              @click="sandboxData.previewType.value = 'oneOperation'"
            >
              One Operation
            </button>
            <button
              :class="{ 'bg-primary text-primary-foreground': sandboxData.previewType.value === 'spec' }"
              class="p-1 text-sm bg-muted rounded"
              @click="sandboxData.previewType.value = 'spec'"
            >
              All Operations
            </button>
          </div>
        </div>

        <div class="flex flex-1 overflow-auto">
          <JsonEditorVue
            v-model="innerValue"
            :main-menu-bar="false"
            :navigation-bar="false"
            :status-bar="false"
            mode="text"
            class="oa-jse w-full"
            :class="{
              'oa-jse-theme-dark': isDark,
              'oa-jse-theme-light': !isDark,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.SandboxEditor {
  position: relative;
  height: 100%;
  width: 100%;
}

.SandboxEditorWrapper {
  position: sticky;
  height: calc(100vh - var(--vp-nav-height));
  max-height: calc(100vh - var(--vp-nav-height));
  top: var(--vp-nav-height);
}

.SandboxEditorWrapper .oa-jse .jse-main {
  @apply p-0;
}
</style>
