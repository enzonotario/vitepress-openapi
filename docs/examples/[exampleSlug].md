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

<OASpec :spec-url="specUrl" />
