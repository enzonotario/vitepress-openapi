---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()

const tag = route.data.params.tag
</script>

<OASpec :tags="[tag]" :isDark="isDark" hide-info hide-servers hide-paths-summary />
