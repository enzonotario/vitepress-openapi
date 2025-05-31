<script setup lang="ts">
import type { Slots } from 'vue'
import { useSlots } from 'vue'
import { cn } from '../../../../src/lib/utils'
import BrowserWindow from './BrowserWindow.vue'

const props = defineProps({
  browserWindowClass: {
    type: String,
    default: '',
  },
  codeSectionTitle: {
    type: String,
    default: 'Example',
  },
  exampleSectionTitle: {
    type: String,
    default: 'Preview',
  },
})

const slots: Slots = useSlots()

function hasSlot(name: string): boolean {
  return slots[name] !== undefined
}
</script>

<template>
  <div class="ExampleBlock flex flex-col gap-4">
    <div v-if="hasSlot('code')" class="flex flex-col gap-1">
      <h3 v-if="props.codeSectionTitle" class="!my-0">
        {{ props.codeSectionTitle }}
      </h3>

      <slot name="code" />
    </div>

    <div class="flex flex-col gap-1">
      <h3 v-if="props.exampleSectionTitle" class="!my-0">
        {{ props.exampleSectionTitle }}
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
