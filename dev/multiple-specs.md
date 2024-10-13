---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import { useOpenapi } from 'vitepress-openapi'
import spec from '../docs/public/openapi.json'
import specV2 from '../docs/public/openapi-v2.json'

const { isDark } = useData()
</script>

<OAOperation operationId="getAllData" :spec="spec" :isDark="isDark" />

---

<OAOperation operationId="buyMuseumTickets" :spec="specV2" :isDark="isDark" />