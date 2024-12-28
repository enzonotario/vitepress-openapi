<script setup lang="ts">
import { inject } from 'vue'
import { Icon } from '@iconify/vue'
import { useToggle } from '@vueuse/core'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import type { SandboxData } from '../../sandboxData'
import ThemeConfig from './ThemeConfig.vue'

const sandboxData = inject('sandboxData') as SandboxData

const [isOpen, toggleOpen] = useToggle(false)
</script>

<template>
  <Popover :open="isOpen">
    <PopoverTrigger
      class="p-2 hover:bg-muted rounded-full"
      :class="{
        'bg-muted': isOpen,
      }"
      @click="toggleOpen()"
    >
      <Icon icon="mdi:cog" />
    </PopoverTrigger>
    <PopoverContent class="w-full max-w-lg h-[70vh] flex flex-col p-0" @interact-outside.prevent="">
      <div class="flex flex-row items-center justify-between px-2 py-1 border-b border-[var(--vp-c-divider)]">
        <h2 class="font-bold">
          Theme Configuration
        </h2>
        <button class="p-2 hover:bg-muted rounded-full" @click="toggleOpen(false)">
          <Icon icon="mdi:close" />
        </button>
      </div>

      <ThemeConfig />
    </PopoverContent>
  </Popover>
</template>
