---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'
import schemasSpec from '../docs/public/openapi-schemas.json'

const { isDark } = useData()
</script>

<OAOperation operationId="getAllArtists" :isDark="isDark" />

---

<OAOperation operationId="getCircularReference" :spec="schemasSpec" :isDark="isDark" />
