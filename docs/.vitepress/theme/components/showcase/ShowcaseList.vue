<script setup lang="ts">
import { Icon } from '@iconify/vue'
import showcases from '@public/showcases.json'

const showcasesList = showcases.map(showcase => ({
  ...showcase,
  domain: new URL(showcase.url).hostname,
}))
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <a
      v-for="showcase in showcasesList"
      :key="showcase.url"
      :href="showcase.url"
      target="_blank"
      rel="noreferrer noopener"
      class="flex aspect-[1.91/1] flex-col rounded border text-center !no-underline"
    >
      <div v-if="showcase.image" class="relative">
        <img :src="showcase.image" alt="showcase" class="w-full h-full object-cover rounded">
        <span class="absolute left-0 bottom-0 w-full z-[2] bg-black/50 p-1 text-sm font-medium text-white backdrop-blur-sm rounded-b">
          {{ showcase.name }}
        </span>
      </div>
      <div v-else class="flex flex-col items-center justify-center gap-4 h-full text-muted-foreground leading-none bg-muted">
        <span class="text-md font-medium">{{ showcase.domain }}</span>
        <span class="text-2xl font-bold text-accent-foreground">{{ showcase.name }}</span>
      </div>
    </a>
  </div>

  <div class="flex justify-center items-center flex-wrap gap-4 mt-8">
    <a
      href="https://github.com/search?q=vitepress-openapi+path%3Apackage.json&type=code"
      target="_blank"
      rel="noreferrer noopener"
      class="py-2 px-3 bg-muted rounded-full !text-muted-foreground !no-underline flex items-center gap-2"
    >
      <Icon icon="mdi:github" class="w-6 h-6" />
      View more
    </a>
    <a
      href="https://github.com/enzonotario/vitepress-openapi/edit/main/docs/public/showcases.json"
      target="_blank"
      rel="noreferrer noopener"
      class="py-2 px-3 bg-primary rounded-full !text-primary-foreground !no-underline flex items-center gap-2"
    >
      <Icon icon="mdi:plus" class="w-6 h-6" />
      Add your own
    </a>
  </div>
</template>

<style scoped>

</style>
