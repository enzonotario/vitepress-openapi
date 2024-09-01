<script setup>
import { ref, watch } from 'vue'
import { useShiki } from 'vitepress-theme-openapi/composables/useShiki'
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const props = defineProps({
  code: {
    type: String,
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

    <vue-json-pretty
      v-if="props.lang === 'json' && !props.disableHtmlTransform"
      :data="JSON.parse(props.code)"
      :theme="props.isDark ? 'dark' : 'light'"
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
