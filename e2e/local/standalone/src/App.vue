<script setup lang="ts">
import { useOpenapi, useTheme } from 'vitepress-openapi/vue'
import { computed, watch } from 'vue'
import AppNavbar from './components/AppNavbar.vue'
import AppSidebar from './components/AppSidebar.vue'
import { baseConfig } from './config'
import { HOME_PATH, resolveRoute, sidebar, spec, testSpecUrl } from './pages'
import { currentPath, navigate } from './router'

if (currentPath.value === '/') {
  navigate(HOME_PATH, { replace: true })
}

const route = computed(() => resolveRoute(currentPath.value))

// Like the docs' test and example pages: each page sets its own theme config.
watch(route, (value) => {
  useTheme().reset()
  useTheme(baseConfig)
  if (value.name === 'test' || value.name === 'example') {
    useTheme(structuredClone(value.page.themeConfig))
  }
}, { immediate: true, flush: 'pre' })

const operations = useOpenapi().getPathsByVerbs()
</script>

<template>
  <div class="app">
    <AppNavbar :title="spec.info.title" :version="spec.info.version" />

    <div class="layout">
      <AppSidebar :items="sidebar" :active-path="currentPath" />

      <main :key="currentPath" class="content">
        <template v-if="route.name === 'introduction'">
          <OAIntroduction />

          <h2>Operations</h2>
          <ul>
            <li v-for="operation in operations" :key="operation.operationId">
              <OAOperationLink
                :operation-id="operation.operationId"
                :method="operation.verb"
                :title="operation.summary"
                :href="`/example/operations/${operation.operationId}`"
              />
              <code>{{ operation.path }}</code>
            </li>
          </ul>
        </template>

        <OAOperation v-else-if="route.name === 'operation'" :operation-id="route.operationId" />

        <OASpec v-else-if="route.name === 'one-page'" />

        <OASpec v-else-if="route.name === 'test'" :spec-url="testSpecUrl(route.page)" />

        <OASpec v-else-if="route.name === 'example'" :spec-url="route.page.specUrl" />

        <p v-else>
          Page not found.
        </p>
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

.content {
  min-width: 0;
  max-width: 1152px;
  padding: 32px 48px;
}
</style>
