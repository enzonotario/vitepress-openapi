---
layout: page
sidebar: false
title: vitepress-openapi
---

<script setup>
import { ref, onMounted } from 'vue'
import { testsPages, examplesPages } from '../pages'

const specs = ref([])
const selectedSpecUrl = ref('')

const defaultSpecs = [
    {
        name: 'Argentine Rock Legends',
        url: '/openapi.json'
    },
]

onMounted(async () => {
  try {
    specs.value = ([
      ...defaultSpecs,
      ...testsPages.map(testPage => ({
        name: testPage.label,
        url: testPage.specPath.replace(/^\.\//, '/'), // Ensure URL starts with '/'
      })),
      ...examplesPages.map(examplePage => ({
        name: examplePage.label,
        url: examplePage.specUrl,
      }))
    ]).sort((a, b) => a.name.localeCompare(b.name))

    selectedSpecUrl.value = specs.value.find(spec => defaultSpecs.some(defaultSpec => defaultSpec.url === spec.url))?.url || specs.value[0].url
  } catch (error) {
    console.error('Error loading OpenAPI specs:', error)
  }
})
</script>

<OASpecPlayground :spec-url="selectedSpecUrl" :key="selectedSpecUrl">

<template #sidebar="{ openapi }">

<div class="OASidebar">
<OAPlaygroundSidebar :openapi="openapi" />
</div>

</template>

<template #playground="{ operationId, openapi }">

<div class="OAContent has-sidebar vp-doc">

<div class="w-full max-w-xs mt-2 mx-auto text-center">
  <label for="spec-select" class="block text-sm font-medium text-[var(--vp-c-text-1)]">
    Select OpenAPI Specification
  </label>
  <select 
    id="spec-select" 
    v-model="selectedSpecUrl" 
    class="w-full p-2 pr-8 border border-[var(--vp-c-divider)] rounded-md bg-muted text-[var(--vp-c-text-1)] appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--vp-c-brand)] focus:border-transparent"
  >
    <option v-for="spec in specs" :key="spec.url" :value="spec.url" class="text-center">
      {{ spec.name }}
    </option>
  </select>
</div>

<div class="OADoc w-full max-w-3xl mx-auto">
<OAOperationPlayground :operation-id="operationId" :openapi="openapi" />
</div>

</div>

</template>

</OASpecPlayground>

[//]: # (</div>)
