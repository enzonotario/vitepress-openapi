---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useData } from 'vitepress'
import { useTheme } from 'vitepress-openapi'
import spec from '../../public/openapi-schemas.json'

const { isDark } = useData()

useTheme({
  operation: {
    defaultBaseUrl: 'https://default.base.url',
    getServers: ({method, path, operation}) => {
      if (operation.operationId === 'getCircularReference') {
        return [] // To force the default base URL.
      }

      // Generate between 1 and 3 random servers.
      const randomServers = Math.floor(Math.random() * 3) + 1

      return Array.from({length: randomServers}, (_, index) => {
        const randomPort = Math.floor(Math.random() * 1000) + 3000
        return {
          url: `https://${method.toLowerCase()}.${operation.operationId}.local:${randomPort}`,
          description: `Localhost ${index + 1}`,
        }
      })
    },
  },
})

onUnmounted(() => {
  useTheme().reset()
})
</script>

<OASpec :spec="spec" :isDark="isDark" />
