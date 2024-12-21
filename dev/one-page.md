---
aside: false
outline: [1, 2]
title: vitepress-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'
import ThemeConfiguration from '../docs/.vitepress/theme/components/ThemeConfiguration.vue'

const { isDark } = useData()
</script>

<div class="relative flex flex-col gap-4">

<ThemeConfiguration />

<OASpec :isDark="isDark" />

</div>
