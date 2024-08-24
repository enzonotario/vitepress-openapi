---
aside: false
outline: false
title: vitepress-theme-openapi
---

<script setup lang="ts">
import { useData } from 'vitepress'
import { useOpenapi } from 'vitepress-theme-openapi'

const { isDark } = useData()

const openapi = useOpenapi()

const operations = openapi.spec.paths

const operationId = Object.keys(operations).length > 0 
    ? operations[Object.keys(operations)[0]].get.operationId 
    : null
</script>

<OAOperation v-if="operationId" :operationId="operationId" :isDark="isDark">

<template #description="description">

#### Custom description slot

<div class="p-3 bg-gray-100 border">
<p>Description content</p>
</div>

```javascript
console.log('Custom description slot')
```

</template>

<template #footer>

<div class="p-4 bg-gray-100">
  <p>Footer content</p>
</div>

</template>

</OAOperation>

## Another title

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
