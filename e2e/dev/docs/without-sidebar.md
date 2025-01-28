---
sidebar: false
aside: true
outline: [1, 2]
title: vitepress-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'
import spec from '@public/openapi.json'
const { isDark } = useData()
</script>

<OASpec :spec="spec" :isDark="isDark" />
