---
aside: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<OASpec :isDark="isDark" />
