---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import { useOpenapi } from 'vitepress-openapi'
import specV2 from '../docs/public/openapi-v2.json'

const { isDark } = useData()
</script>

<OAOperation operationId="getAllArtists" :isDark="isDark" />

---

<OAOperation operationId="buyMuseumTickets" :spec="specV2" :isDark="isDark" />
