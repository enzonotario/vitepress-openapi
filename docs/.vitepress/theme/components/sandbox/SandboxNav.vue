<script setup lang="ts">
import VPSwitchAppearance from '../../../../../src/components/Common/VPSwitchAppearance.vue'
</script>

<template>
  <header>
    <div class="flex items-center justify-between bg-[var(--vp-nav-bg-color)] border-b border-[var(--vp-c-divider)]">
      <div class="SandboxNavBar w-full mx-auto p-2">
        <div class="flex items-center justify-between">
          <div class="title flex items-center">
            <div>
              <a
                class="text-sm"
                href="/sandbox"
              >
                <span class="font-bold">VitePress OpenAPI</span> <span class="text-primary">Sandbox</span>
              </a>
            </div>
          </div>

          <div class="flex items-center">
            <slot />
          </div>

          <div class="flex items-center gap-2">
            <slot name="end" />
            <a class="VPLink link VPNavBarMenuLink" href="/"><span>Docs</span></a>
            <OALocaleSelect />
            <VPSwitchAppearance />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.SandboxNavBar {
  max-width: calc(var(--vp-layout-max-width) - 64px);
}
</style>
