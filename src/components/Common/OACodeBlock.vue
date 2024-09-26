<script setup>
import { computed, ref, watch } from 'vue'
import { useShiki } from 'vitepress-theme-openapi/composables/useShiki'
import { useTheme } from 'vitepress-theme-openapi'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import { destr } from 'destr'

const props = defineProps({
  code: {
    type: [String, Object, Array],
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
  isDark: {
    type: Boolean,
    default: false,
  },
  disableHtmlTransform: {
    type: Boolean,
    default: false,
  },
})

const html = ref(null)

const shiki = useShiki()

const themeConfig = useTheme()

const jsonData = computed(() => {
  return typeof props.code === 'string' ? destr(props.code) : props.code
})

watch(
  [() => props.code, () => props.lang, () => props.isDark],
  async () => {
    if (props.lang === 'json') {
      return
    }

    if (props.disableHtmlTransform) {
      html.value = `<pre><code>${props.code}</code></pre>`
      return
    }

    html.value = shiki.renderShiki(props.code, {
      lang: props.lang,
      theme: props.isDark ? 'vitesse-dark' : 'vitesse-light',
    })
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div
    class="vp-adaptive-theme min-h-16"
    :class="[`language-${props.lang}`]"
  >
    <button
      title="Copy Code"
      class="copy"
    />
    <span class="lang">{{ props.label }}</span>

    <VueJsonPretty
      v-if="props.lang === 'json' && !props.disableHtmlTransform"
      :data="jsonData"
      :theme="props.isDark ? 'dark' : 'light'"
      :deep="themeConfig.getJsonViewerDeep()"
      show-icon
      class="p-2"
    />

    <div
      v-else-if="html && !props.disableHtmlTransform"
      class="vp-adaptive-theme"
      v-html="html"
    />

    <pre v-else>{{ props.code }}</pre>
  </div>
</template>
