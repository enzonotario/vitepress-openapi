---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useRoute, useData } from 'vitepress'
import { useTheme } from 'vitepress-theme-openapi'
import spec from '../../docs/public/openapi-criptoya-argentina.json'

const route = useRoute()

const { isDark } = useData()

useTheme().setJsonViewerDeep(1)
useTheme().setSchemaViewerDeep(1)

onUnmounted(() => {
    useTheme().setJsonViewerDeep(Infinity)
    useTheme().setSchemaViewerDeep(Infinity)
})
</script>

<OASpec :spec="spec" :isDark="isDark" />
