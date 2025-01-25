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
})

const themeConfig = useTheme()

const isDark = themeConfig.isDark

const html = ref(null)

const shiki = useShiki()

const jsonData = computed(() => {
  return typeof props.code === 'string' ? destr(props.code) : props.code
})

watch(
  [() => props.code, () => props.lang, isDark],
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
      theme: isDark.value ? 'vitesse-dark' : 'vitesse-light',
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
      :theme="isDark ? 'dark' : 'light'"
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
