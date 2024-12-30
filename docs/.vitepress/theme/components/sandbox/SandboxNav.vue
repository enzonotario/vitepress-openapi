<script setup lang="ts">
import VPSwitchAppearance from '../vitepress/VPSwitchAppearance.vue'
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
          <VPSwitchAppearance />
          <div class="VPSocialLinks VPNavBarSocialLinks social-links">
            <a
              class="VPSocialLink no-icon flex items-center justify-center w-[36px] h-[36px] text-[var(--vp-c-text-2)] hover:text-[var(--vp-c-text-1)]"
              href="https://github.com/enzonotario/vitepress-openapi"
              aria-label="github"
              target="_blank"
              rel="noopener"
            >
              <span class="vpi-social-github" />
            </a>
          </div>
          <slot name="end" />
        </div>
      </div>
    </div>
  </header>
</template>
