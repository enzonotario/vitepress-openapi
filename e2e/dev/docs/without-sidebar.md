---
sidebar: false
aside: true
outline: [1, 2]
title: vitepress-openapi
---

<script setup lang="ts">
import spec from '@public/openapi.json'
</script>

<OASpec :spec="spec" />
