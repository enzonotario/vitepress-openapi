---
layout: page
sidebar: false
title: vitepress-openapi
---

<script setup>
import { usePlaygroundSpecSelection } from '../.vitepress/theme/composables/usePlaygroundSpecSelection'

const { selectedSpecUrl } = usePlaygroundSpecSelection()
</script>

<OASpecPlayground :spec-url="selectedSpecUrl" :key="selectedSpecUrl">
  <template #sidebar="{ openapi }">
    <div class="px-1 pb-3 text-xs font-semibold uppercase tracking-wide text-[var(--vp-c-text-2)]">
      Custom Playground Sidebar
    </div>

    <OAPlaygroundSidebar :openapi="openapi" />
  </template>
</OASpecPlayground>
