---
aside: false
outline: [1, 2]
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import ThemeConfiguration from './.vitepress/theme/components/ThemeConfiguration.vue'

const route = useRoute()

const { isDark } = useData()
</script>

<ThemeConfiguration />

<OASpec :isDark="isDark" />
