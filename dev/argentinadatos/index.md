---
aside: false
outline: false
title: vitepress-openapi
---

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import spec from '../../docs/public/openapi-argentinadatos.json'

const route = useRoute()

const { isDark } = useData()
</script>

<OASpec :spec="spec" :isDark="isDark" />
