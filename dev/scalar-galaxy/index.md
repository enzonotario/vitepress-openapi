---
aside: true
outline: [1, 2]
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import spec from '../../docs/public/openapi.json'

const route = useRoute()

const { isDark } = useData()
</script>

<OASpec :spec="spec" :isDark="isDark" />
