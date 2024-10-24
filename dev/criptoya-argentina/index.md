---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { onUnmounted } from 'vue'
import { useRoute, useData } from 'vitepress'
import { useTheme } from 'vitepress-openapi'
import spec from '../../docs/public/openapi-criptoya-argentina.json'

const route = useRoute()

const { isDark } = useData()

useTheme({
    jsonViewer: {
        deep: 1,
    },
    schemaViewer: {
        deep: 1,
    },
    request: {
        defaultView: 'schema',
    },
})

onUnmounted(() => {
    useTheme({
        jsonViewer: {
            deep: Infinity,
        },
        schemaViewer: {
            deep: Infinity,
        },
        request: {
            defaultView: 'json',
        },
    })
})
</script>

<OASpec :spec="spec" :isDark="isDark" />
