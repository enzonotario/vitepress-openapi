<script setup>
import { useShiki } from '../../composables/useShiki'
import { useTheme } from '../../composables/useTheme'
import 'vue-json-pretty/lib/styles.css'

const props = defineProps({
  code: {
    type: [String, Object, Array, Number, Boolean],
    required: true,
  },
  lang: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  disableHtmlTransform: {
    type: Boolean,
    default: false,
  },
})

const themeConfig = useTheme()

const isDark = themeConfig.isDark

const shiki = useShiki()

const html = shiki.renderShiki(props.code, {
  lang: props.lang,
  theme: isDark.value ? 'vitesse-dark' : 'vitesse-light',
})
</script>

<template>
  <div
    class="vp-adaptive-theme"
    v-html="html"
  />
</template>
