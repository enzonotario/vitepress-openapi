---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { useTheme } from 'vitepress-openapi/client'

const route = useRoute()

const testSlug = route.data.params.testSlug
const spec = JSON.parse(JSON.stringify(route.data.params.spec))
const themeConfig = route.data.params.themeConfig

useTheme(themeConfig)

onUnmounted(() => {
    useTheme().reset()
})
</script>

<OASpec :spec="spec" />
