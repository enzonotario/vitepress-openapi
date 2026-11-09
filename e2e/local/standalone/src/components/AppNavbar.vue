<script setup lang="ts">
import { withBase } from '../base'
import AppearanceSwitch from './AppearanceSwitch.vue'

defineProps<{
  title: string
  version?: string
}>()
</script>

<template>
  <header class="navbar">
    <a class="title" :href="withBase('/')">
      {{ title }}
      <span v-if="version" class="version">v{{ version }}</span>
    </a>
    <AppearanceSwitch />
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: var(--vp-nav-height);
  padding: 0 24px;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.version {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>
