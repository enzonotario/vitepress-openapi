---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import { useOpenapi } from 'vitepress-theme-openapi'
import spec from '../public/openapi.json'
import specV2 from '../public/openapi-v2.json'

const { isDark } = useData()
</script>

::: info
Using [default spec](../public/openapi.json)
:::

<OAOperation operationId="buyMuseumTickets" :spec="spec" :isDark="isDark" />

---

::: info
Using [v2 spec](../public/openapi-v2.json)
:::

<OAOperation operationId="buyMuseumTickets" :spec="specV2" :isDark="isDark" />
