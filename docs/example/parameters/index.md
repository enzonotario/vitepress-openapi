---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'
import spec from '../../public/openapi-parameters.json'

const { isDark } = useData()
</script>

<OASpec :spec="spec" :isDark="isDark" />