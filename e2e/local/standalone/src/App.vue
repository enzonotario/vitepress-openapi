<script setup lang="ts">
import { useSidebar } from 'vitepress-openapi/vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import spec from '../../../../docs/public/openapi.json'
import AppNavbar from './components/AppNavbar.vue'
import { OPERATION_PREFIX } from './routes'

// The package provides the sidebar data; the app owns the UI and the routing.
const groups = useSidebar({ spec, linkPrefix: OPERATION_PREFIX }).generateSidebarGroups()

const firstLink = groups.flatMap(group => group.items ?? [])[0]?.link ?? ''

const hash = ref(window.location.hash)

function onHashChange() {
  hash.value = window.location.hash
  window.scrollTo({ top: 0 })
}

window.addEventListener('hashchange', onHashChange)
onBeforeUnmount(() => window.removeEventListener('hashchange', onHashChange))

const activeLink = computed(() => hash.value.startsWith(OPERATION_PREFIX) ? hash.value : firstLink)

const operationId = computed(() => decodeURIComponent(activeLink.value.slice(OPERATION_PREFIX.length)))
</script>

<template>
  <div class="app">
    <AppNavbar :title="spec.info.title" :version="spec.info.version" />

    <div class="layout">
      <nav class="sidebar" aria-label="Operations">
        <section v-for="group in groups" :key="group.text">
          <p class="group">
            {{ group.text }}
          </p>
          <a
            v-for="item in group.items"
            :key="item.link"
            :href="item.link"
            :class="{ active: item.link === activeLink }"
            :aria-current="item.link === activeLink ? 'page' : undefined"
            v-html="item.text"
          />
        </section>
      </nav>

      <main class="content vp-doc">
        <OAOperation :key="operationId" :operation-id="operationId" />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app {
  /* Used by the library for anchor scroll offsets, like VitePress' navbar height. */
  --vp-nav-height: 64px;
}

.layout {
  display: grid;
  grid-template-columns: 272px minmax(0, 1fr);
  min-height: calc(100vh - var(--vp-nav-height));
}

.sidebar {
  position: sticky;
  top: var(--vp-nav-height);
  height: calc(100vh - var(--vp-nav-height));
  overflow-y: auto;
  padding: 24px 16px;
  border-right: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
}

.group {
  margin: 16px 8px 4px;
  font-size: 14px;
  font-weight: 700;
}

.sidebar a {
  display: block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.sidebar a:hover,
.sidebar a.active {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-3);
}

.content {
  max-width: 1152px;
  padding: 32px 48px;
}
</style>
