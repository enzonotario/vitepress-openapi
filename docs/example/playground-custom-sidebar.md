---
aside: false
outline: false
title: vitepress-openapi
---

<script setup>
import spec from '../public/openapi.json' with { type: 'json' }
</script>

<OASpecPlayground :spec="spec" />
