---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<OASpec :isDark="isDark" />
