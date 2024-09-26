---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'
import spec from '../../docs/public/openapi-response-statuses.json'

const { isDark } = useData()
</script>

<OASpec :spec="spec" :isDark="isDark" />
