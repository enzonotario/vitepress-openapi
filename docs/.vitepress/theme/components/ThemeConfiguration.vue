<script setup>
import { useTheme } from 'vitepress-openapi'
import { onMounted, ref, watch } from 'vue'
import { useUrlSearchParams } from '@vueuse/core'
import { compressToURL, decompressFromURL } from '@amoutonbrady/lz-string'
import { DEFAULT_OPERATION_SLOTS } from '../../../../src/index'

const params = useUrlSearchParams('history')

const sticky = ref(true)

const themeConfig = useTheme()

watch(() => themeConfig.getState(), (state) => {
  params.themeConfig = compressToURL(JSON.stringify({
    ...state,
    theme: undefined,
    i18n: undefined,
  }))
}, { deep: true })

onMounted(() => {
  useTheme(params.themeConfig ? JSON.parse(decompressFromURL(params.themeConfig)) : {})
})
</script>

<template>
  <div
    :class="{
      'sticky top-[65px] max-h-[250px] z-50 ': sticky,
    }"
    class="flex flex-col gap-2 p-2 bg-white border-b"
  >
    <div class="flex justify-between items-center">
      <h3>Theme Configuration</h3>
      <button
        class="text-sm hover:bg-primary hover:text-primary-foreground rounded px-2 py-1"
        @click="sticky = !sticky"
      >
        {{ sticky ? 'Unstick' : 'Stick' }}
      </button>
    </div>

    <div
      :class="{
        'overflow-y-auto': sticky,
      }"
      class="flex flex-col gap-2"
    >
      <h3>Spec</h3>
      <div class="grid grid-cols-3 items-start gap-4">
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

      <h3>Operation</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h5>Hidden Slots</h5>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <label v-for="slot in DEFAULT_OPERATION_SLOTS" :key="slot" class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="themeConfig.getOperationHiddenSlots().includes(slot)"
                @change="themeConfig.getOperationHiddenSlots().includes(slot) ? themeConfig.getOperationHiddenSlots().splice(themeConfig.getOperationHiddenSlots().indexOf(slot), 1) : themeConfig.getOperationHiddenSlots().push(slot)"
              >
              {{ slot }}
            </label>
          </div>
        </div>

        <div>
          <h5>Operation Columns</h5>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="col in [1, 2]" :key="col" class="flex items-center gap-2">
              <input
                type="radio"
                :checked="themeConfig.getOperationCols() === col"
                @change="themeConfig.setOperationCols(col)"
              >
              {{ col }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin-top: 0;
}
</style>
