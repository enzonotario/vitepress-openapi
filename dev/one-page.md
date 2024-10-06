---
aside: true
outline: [1, 2]
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OASpec :isDark="isDark" />
