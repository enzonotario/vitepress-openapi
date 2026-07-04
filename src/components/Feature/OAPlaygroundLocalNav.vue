<script setup lang="ts">
defineProps<{
  open: boolean
  sidebarNavId: string
}>()

defineEmits<{
  (e: 'openMenu'): void
}>()
</script>

<template>
  <div class="OAPlaygroundLocalNav">
    <div class="container">
      <button
        class="menu"
        :aria-expanded="open"
        :aria-controls="sidebarNavId"
        @click="$emit('openMenu')"
      >
        <span class="vpi-align-left menu-icon" />
        <span class="menu-text">
          Menu
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.OAPlaygroundLocalNav {
  position: sticky;
  top: 0;
  left: 0;
  z-index: var(--vp-z-index-local-nav);
  border-bottom: 1px solid var(--vp-c-gutter);
  padding-top: var(--vp-layout-top-height, 0px);
  width: 100%;
  background-color: var(--vp-local-nav-bg-color);
}

.container {
  display: flex;
  align-items: center;
}

.menu {
  display: flex;
  align-items: center;
  padding: 12px 24px 11px;
  line-height: 24px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: color 0.5s;
}

.menu:hover {
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

@media (min-width: 768px) {
  .menu {
    padding: 0 32px;
  }
}

@media (min-width: 960px) {
  .OAPlaygroundLocalNav {
    display: none;
  }
}

.menu-icon {
  margin-right: 8px;
  font-size: 14px;
}
</style>
