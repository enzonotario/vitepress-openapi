<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'
import { inject, nextTick, ref, watch, watchEffect } from 'vue'
import type { SandboxData } from '../types'
import { useData } from 'vitepress'

const { isDark } = useData()

const sandboxData = inject('sandboxData') as SandboxData

const innerValue = ref(JSON.stringify(sandboxData.spec.value, null, 2))

watchEffect(() => {
  innerValue.value = JSON.stringify(sandboxData.spec.value, null, 2)
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
</script>

<template>
  <div class="SandboxEditor">
    <div class="SandboxEditorWrapper">
      <div class="w-full h-full flex flex-col">
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
