---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<OAOperation operationId="get-feriados" :isDark="isDark">

<template #description="description">

<div class="p-3 bg-gray-100">
<p>Description content</p>
</div>

</template>

<template #footer>

<div class="p-4 bg-gray-100">
  <p>Footer content</p>
</div>

</template>

</OAOperation>
