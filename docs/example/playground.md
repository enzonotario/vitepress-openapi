---
layout: page
sidebar: false
title: vitepress-openapi
---

<script setup>
import { usePlaygroundSpecSelection } from '../.vitepress/theme/composables/usePlaygroundSpecSelection'

const { selectedSpecUrl } = usePlaygroundSpecSelection()
</script>

<OASpecPlayground :spec-url="selectedSpecUrl" :key="selectedSpecUrl">

<template #sidebar="{ openapi }">

<div class="OASidebar">
<OAPlaygroundSidebar :openapi="openapi" />
</div>

</template>

<template #playground="{ operationId, openapi }">

<div class="OAContent has-sidebar vp-doc">

<div class="OADoc w-full max-w-3xl mx-auto">
<OAOperationPlayground :operation-id="operationId" :openapi="openapi" />
</div>

</div>

</template>

</OASpecPlayground>

[//]: # (</div>)
