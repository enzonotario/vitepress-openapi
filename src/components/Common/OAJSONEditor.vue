<script setup>
import JsonEditorVue from 'json-editor-vue'
import { computed } from 'vue'
import { useTheme } from 'vitepress-openapi'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

const themeConfig = useTheme()
</script>

<template>
  <JsonEditorVue
    v-model="value"
    :main-menu-bar="themeConfig.getPlaygroundJsonEditorMainMenuBar()"
    :navigation-bar="themeConfig.getPlaygroundJsonEditorNavigationBar()"
    :mode="themeConfig.getPlaygroundJsonEditorMode()"
    class="oa-jse"
    :class="{
      'oa-jse-theme-dark': props.isDark,
      'oa-jse-theme-light': !props.isDark,
    }"
  />
</template>
