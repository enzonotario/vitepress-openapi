<script setup lang="ts">
import type { SandboxData } from '../../sandboxData'
import JsonEditorVue from 'json-editor-vue'
import { useData } from 'vitepress'
import { inject, nextTick, ref, watch, watchEffect } from 'vue'

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
    <div
      class="SandboxEditorWrapper"
      :class="{ 'has-nav': !sandboxData.hideSandboxNav.value }"
    >
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
  height: calc(100vh);
  max-height: calc(100vh);
  top: 0;
}
.SandboxEditorWrapper.has-nav {
  height: calc(100vh - var(--vp-nav-height));
  max-height: calc(100vh - var(--vp-nav-height));
  top: var(--vp-nav-height);
}

.SandboxEditorWrapper .oa-jse .jse-main {
  @apply p-0;
}
</style>
