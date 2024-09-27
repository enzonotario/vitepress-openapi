---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'
import spec from '../../public/openapi-schemas.json'

const { isDark } = useData()
</script>

<OASpec :spec="spec" :isDark="isDark" />
