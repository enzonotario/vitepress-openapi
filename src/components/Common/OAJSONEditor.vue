<script setup>
import JsonEditorVue from 'json-editor-vue'
import { computed } from 'vue'
import { useDark } from '@vueuse/core'
import { useTheme } from '../../composables/useTheme'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const themeConfig = useTheme()

const isDark = useDark({
  storageKey: 'vitepress-theme-appearance',
})
</script>

<template>
  <JsonEditorVue
    v-model="value"
    :main-menu-bar="themeConfig.getPlaygroundJsonEditorMainMenuBar()"
    :navigation-bar="themeConfig.getPlaygroundJsonEditorNavigationBar()"
    :mode="themeConfig.getPlaygroundJsonEditorMode()"
    class="oa-jse"
    :class="{
      'oa-jse-theme-dark': isDark,
      'oa-jse-theme-light': !isDark,
    }"
  />
</template>
