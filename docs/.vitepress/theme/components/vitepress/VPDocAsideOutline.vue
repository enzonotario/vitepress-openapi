<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { useData } from 'vitepress'
import {
  getHeaders,
  resolveTitle,
  useActiveAnchor,
} from 'vitepress/dist/client/theme-default/composables/outline.js'
import VPDocOutlineItem from 'vitepress/dist/client/theme-default/components/VPDocOutlineItem.vue'
import type { SandboxData } from '../../sandboxData'

const { theme } = useData()

const sandboxData = inject('sandboxData') as SandboxData

const container = ref()
const marker = ref()

useActiveAnchor(container, marker)

watch([sandboxData.spec, sandboxData.operationId, sandboxData.previewComponent], () => {
  sandboxData.previewHeaders.value = getHeaders(theme.value.outline)
}, {
  immediate: true,
})
</script>

<template>
  <nav
    ref="container"
    aria-labelledby="doc-outline-aria-label"
    class="VPDocAsideOutline"
    :class="{ 'has-outline': sandboxData.previewHeaders.value.length > 0 }"
  >
    <div class="content">
      <div ref="marker" class="outline-marker" />

      <div
        id="doc-outline-aria-label"
        aria-level="2"
        class="outline-title"
        role="heading"
      >
        {{ resolveTitle(theme) }}
      </div>

      <VPDocOutlineItem :headers="sandboxData.previewHeaders.value" :root="true" />
    </div>
  </nav>
</template>

<style scoped>
.VPDocAsideOutline {
  display: none;
}

.VPDocAsideOutline.has-outline {
  display: block;
}

.content {
  position: relative;
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 16px;
  font-size: 13px;
  font-weight: 500;
}

.outline-marker {
  position: absolute;
  top: 32px;
  left: -1px;
  z-index: 0;
  opacity: 0;
  width: 2px;
  border-radius: 2px;
  height: 18px;
  background-color: var(--vp-c-brand-1);
  transition:
    top 0.25s cubic-bezier(0, 1, 0.5, 1),
    background-color 0.5s,
    opacity 0.25s;
}

.outline-title {
  line-height: 32px;
  font-size: 14px;
  font-weight: 600;
}
</style>
