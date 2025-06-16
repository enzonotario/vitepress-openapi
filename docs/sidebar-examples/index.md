---
aside: false
outline: false
prev: false
next: false
---

<script setup>
import { examples } from '../sidebar-examples-configs.ts'

const list = examples.map(example => {
return `<ul><li><a href="/sidebar-examples/${example.slug}">${example.label}</a></li></ul>`
}).join('\n')
</script>

# Sidebar Examples

This is a collection of examples that demonstrate how to use the `useSidebar` function to generate custom sidebars.

<div v-html="list"></div>
