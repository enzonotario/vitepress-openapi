---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vitepress'
import { useTheme } from 'vitepress-openapi/client'

const route = useRoute()

const exampleSlug = route.data.params.exampleSlug
const specUrl = route.data.params.specUrl
const themeConfig = route.data.params.themeConfig

onBeforeMount(() => {
    useTheme(themeConfig)
})

onBeforeUnmount(() => {
    useTheme().reset()
})
</script>

<!-- The theme config above is applied on mount (client only); pass lazy-rendering as a prop so it also applies during SSR. -->
<OASpec :spec-url="specUrl" :lazy-rendering="themeConfig.spec?.lazyRendering" />
