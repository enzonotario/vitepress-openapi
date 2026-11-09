<script setup lang="ts">
import type { SidebarItem } from 'vitepress-openapi/vue'

defineProps<{
  items: SidebarItem[]
  activePath: string
}>()
</script>

<template>
  <nav class="sidebar" aria-label="Pages">
    <details v-for="section in items" :key="section.text" open>
      <summary class="section">
        {{ section.text }}
      </summary>

      <template v-for="item in section.items" :key="item.link ?? item.text">
        <div v-if="item.items" class="group">
          <p class="group-title">
            {{ item.text }}
          </p>
          <a
            v-for="child in item.items"
            :key="child.link"
            :href="child.link"
            :class="{ active: child.link === activePath }"
            :aria-current="child.link === activePath ? 'page' : undefined"
            v-html="child.text"
          />
        </div>
        <a
          v-else
          :href="item.link"
          :class="{ active: item.link === activePath }"
          :aria-current="item.link === activePath ? 'page' : undefined"
          v-html="item.text"
        />
      </template>
    </details>
  </nav>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: var(--vp-nav-height);
  height: calc(100vh - var(--vp-nav-height));
  overflow-y: auto;
  padding: 16px;
  border-right: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
}

details + details {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--vp-c-divider);
}

.section {
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.group {
  margin-top: 8px;
}

.group-title {
  margin: 0;
  padding: 4px 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

a {
  display: block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.group a {
  padding-left: 16px;
}

a:hover,
a.active {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-3);
}
</style>
