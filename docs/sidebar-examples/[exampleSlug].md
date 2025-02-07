---
aside: false
outline: false
title: Sidebar Example
prev: false
next: false
---

<script setup lang="ts">
import { useRoute } from 'vitepress'

const route = useRoute()

const exampleSlug = route.data.params.exampleSlug
const code = route.data.params.code
</script>

# Sidebar Example: `{{ exampleSlug }}`

This is a custom sidebar example generated from the following code:

```js-vue
import { defineConfig } from 'vitepress'
import { useSidebar } from 'vitepress-openapi'
import spec from '../docs/public/openapi.json'

{{code}}
```

--- 

[Back to Sidebar Examples](/sidebar-examples/) 
