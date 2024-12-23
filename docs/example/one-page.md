---
aside: true
outline: [1, 2]
title: vitepress-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'

const { isDark } = useData()
</script>

<div class="relative flex flex-col gap-4">

<OASpec :isDark="isDark" />

</div>
