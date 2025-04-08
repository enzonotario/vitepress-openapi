<script setup>
import { destr } from 'destr'
import { computed, ref, watch } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
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
  active: {
    type: Boolean,
    default: false,
  },
})

const themeConfig = useTheme()

const isDark = themeConfig.isDark

const html = ref(null)

const shiki = useShiki()

const jsonData = computed(() => {
  return typeof props.code === 'string' ? destr(props.code) : props.code
})

const jsonViewerDeep = computed(() => {
  return themeConfig.getJsonViewerDeep()
})

const jsonViewerRenderer = computed(() => {
  return themeConfig.getJsonViewerRenderer()
})

watch(
  [() => props.code, () => props.lang, isDark, () => props.active],
  async () => {
    if (props.lang === 'json' && jsonViewerRenderer.value !== 'shiki') {
      return
    }

    if (!props.active || props.disableHtmlTransform) {
      html.value = `<pre><code>${props.code}</code></pre>`
      return
    }

    const codeToHighlight = typeof props.code === 'string' ? props.code : JSON.stringify(props.code, null, 2)
    await shiki.initShiki()
    const highlightedCode = shiki.renderShiki(codeToHighlight, {
      lang: props.lang,
      theme: isDark.value ? 'vitesse-dark' : 'vitesse-light',
    })
    html.value = highlightedCode.replace(/background-color:[^;]+;/g, 'background-color:transparent;')
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="vp-adaptive-theme min-h-16" :class="[`language-${props.lang}`]">
    <button
      title="Copy Code"
      class="copy"
    />
    <span class="lang">{{ props.label }}</span>

    <VueJsonPretty
      v-if="props.lang === 'json' && !props.disableHtmlTransform && jsonViewerRenderer === 'vue-json-pretty'"
      :data="jsonData"
      :theme="isDark ? 'dark' : 'light'"
      :deep="jsonViewerDeep"
      show-icon
      class="p-2"
    />

    <div
      v-else-if="html && !props.disableHtmlTransform"
      v-html="html"
    />

    <pre v-else>{{ props.code }}</pre>
  </div>
</template>
