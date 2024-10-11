<script setup>
import { useTheme } from 'vitepress-openapi'

const themeConfig = useTheme()
</script>

<template>
  <div class="grid grid-cols-3 items-start gap-4 p-2 bg-muted mb-4">
    <label for="themeConfig" class="col-span-3 text-lg font-bold">
      Theme Configuration
    </label>

    <label for="groupByTags" class="flex items-center gap-2">
      <input
        id="groupByTags"
        type="checkbox"
        :checked="themeConfig.getSpecConfig().groupByTags.value"
        @change="themeConfig.setSpecConfig({ groupByTags: $event.target.checked })"
      >
      Group by tags
    </label>

    <div class="flex flex-col">
      <label for="collapsePaths" class="flex items-center gap-2">
        <input
          id="collapsePaths"
          type="checkbox"
          :checked="themeConfig.getSpecConfig().collapsePaths.value"
          @change="themeConfig.setSpecConfig({ collapsePaths: $event.target.checked })"
        >
        Collapse paths

      </label>
      <small class="text-gray-500 dark:text-gray-400">
        Toggle `Group by tags` to see the effect
      </small>
    </div>

    <label for="showPathsSummary" class="flex items-center gap-2">
      <input
        id="showPathsSummary"
        type="checkbox"
        :checked="themeConfig.getSpecConfig().showPathsSummary.value"
        @change="themeConfig.setSpecConfig({ showPathsSummary: $event.target.checked })"
      >
      Show paths summary
    </label>
  </div>
</template>
