---
aside: true
outline: [1, 2]
title: vitepress-openapi
---

<script setup>
import { useOpenapi } from 'vitepress-openapi/client'

const paths = useOpenapi().getPathsByVerbs()
</script>

<OAInfo />

<OAServers />

## Operations

<template v-for="path in paths">

- <OAOperationLink :operationId="path.operationId" :method="path.verb" :title="path.summary" :href="`/example/operations/${path.operationId}`" :key="path.operationId">[{{path.summary}}]() `{{path.path}}`</OAOperationLink>

</template>
