---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import spec from '../../docs/public/openapi-plantstore.json'

const route = useRoute()

const { isDark } = useData()
</script>

<OASpec :spec="spec" :isDark="isDark" />