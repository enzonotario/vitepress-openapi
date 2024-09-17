---
aside: true
outline: [1, 2]
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<OASpec :isDark="isDark" />
