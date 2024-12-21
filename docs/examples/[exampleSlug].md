---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute, useData } from 'vitepress'
import { useTheme } from 'vitepress-openapi'

const route = useRoute()

const { isDark } = useData()

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

<OARemoteSpec :spec-url="specUrl" :isDark="isDark" />
