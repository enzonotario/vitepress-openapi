<script setup lang="ts">
import VPSwitchAppearance from '../../../../../src/components/Common/VPSwitchAppearance.vue'
</script>

<template>
  <header>
    <div class="h-[var(--vp-nav-height)] bg-[var(--vp-nav-bg-color)] border-b border-[var(--vp-c-divider)]">
      <div class="w-full h-full px-2 lg:px-4 grid grid-cols-3">
        <div class="flex flex-row items-center gap-3">
          <div class="title flex items-center">
            <div>
              <a class="text-sm" href="/sandbox">
                <span class="font-bold">VitePress OpenAPI</span> <span class="text-primary">Sandbox</span>
              </a>
            </div>
          </div>

          <div class="border-r border-[var(--vp-c-divider)] h-6" />

          <slot name="start" />
        </div>

        <slot />

        <div class="flex items-center gap-2">
          <span class="flex-1" />
          <slot name="end" />
          <VPSwitchAppearance />
        </div>
      </div>
    </div>
  </header>
</template>
