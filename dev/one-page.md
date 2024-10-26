---
aside: false
outline: [1, 2]
title: vitepress-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'
import ThemeConfiguration from './.vitepress/theme/components/ThemeConfiguration.vue'

const { isDark } = useData()
</script>

<ThemeConfiguration />

<OASpec :isDark="isDark" >

<template #description="props">

<div class="flex flex-wrap gap-2">
<span v-for="tag in props.operation.tags" :key="tag" class="px-2 py-1 bg-muted rounded-full">{{tag}}</span>
</div>

{{props.operation.description}}

</template>

</OASpec>
