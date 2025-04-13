<script setup lang="ts">
import { cn } from '../../../../src/lib/utils'
import BrowserWindow from './BrowserWindow.vue'

const props = defineProps({
  browserWindowClass: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="ExampleBlock flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <h3 class="!my-0">
        Example
      </h3>

      <slot name="code" />
    </div>

    <div class="flex flex-col gap-1">
      <h3 class="!my-0">
        Preview
      </h3>

      <BrowserWindow :class="cn('', props.browserWindowClass)">
        <div class="p-4 lg:p-8">
          <slot name="example" />
        </div>
      </BrowserWindow>
    </div>
  </div>
</template>

<style>
.ExampleBlock .vp-adaptive-theme {
  height: 100%;
  max-height: 60vh;
  overflow-y: auto;
  margin: 0 !important;
}
</style>
