---
layout: page
sidebar: false
title: vitepress-openapi
---

<script setup>
import { usePlaygroundSpecSelection } from '../.vitepress/theme/composables/usePlaygroundSpecSelection'

const { selectedSpecUrl } = usePlaygroundSpecSelection()
</script>

<OASpecPlayground :spec-url="selectedSpecUrl" :key="selectedSpecUrl">
<template #sidebar="{ openapi }">
<OAPlaygroundSidebar v-bind:openapi="openapi"></OAPlaygroundSidebar>
</template>
</OASpecPlayground>
