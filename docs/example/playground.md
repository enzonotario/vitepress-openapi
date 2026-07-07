---
aside: false
outline: false
title: vitepress-openapi
next: false
prev: false
---

<script setup>
import { usePlaygroundSpecSelection } from '../.vitepress/theme/composables/usePlaygroundSpecSelection'

const { selectedSpecUrl } = usePlaygroundSpecSelection()
</script>

<OASpecPlayground :spec-url="selectedSpecUrl" :key="selectedSpecUrl" />
