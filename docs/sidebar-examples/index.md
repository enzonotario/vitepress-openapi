---
aside: false
outline: false
---

<script setup>
import { examples } from '../sidebars'

const list = examples.map(example => {
return `<ul><li><a href="/sidebar-examples/${example.slug}">${example.label}</a></li></ul>`
}).join('\n')
</script>

# Sidebar Examples

This is a collection of examples that demonstrate how to use the `useSidebar` function to generate custom sidebars.

<div v-html="list"></div>
