<script setup lang="ts">
import { useTheme } from 'vitepress-openapi/vue'

// Outside VitePress, `isDark` is writable: it toggles the `dark` class on <html> and remembers the choice.
const isDark = useTheme().isDark

function toggle() {
  isDark.value = !isDark.value
}
</script>

<template>
  <button
    type="button"
    role="switch"
    class="switch"
    :aria-checked="isDark"
    :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <span class="check">
      <!-- Sun -->
      <svg v-if="!isDark" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <!-- Moon -->
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </span>
  </button>
</template>

<style scoped>
.switch {
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 11px;
  background-color: var(--vp-c-default-3);
  cursor: pointer;
  transition: border-color 0.25s;
}

.switch:hover {
  border-color: var(--vp-c-brand-1);
}

.check {
  position: absolute;
  top: 1px;
  left: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--vp-c-bg);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s;
}

.switch[aria-checked='true'] .check {
  transform: translateX(18px);
}

svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: var(--vp-c-text-2);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
