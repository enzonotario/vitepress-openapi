<script setup>
import { computed, ref, watch } from 'vue'
import { useShiki } from '../../../composables/useShiki'
import { useTheme } from '../../../composables/useTheme'

const props = defineProps({
  code: {
    type: [String, Object, Array, Number, Boolean],
    required: true,
  },
  lang: {
    type: String,
    required: true,
  },
})

const RE_BG_COLOR = /background-color:[^;]+;/g

const themeConfig = useTheme()

const isDark = themeConfig.isDark

const shiki = useShiki()

const html = ref(null)

// Rendered as plain code until the highlighted HTML is ready, so the code never disappears.
const codeText = computed(() => typeof props.code === 'string' ? props.code : JSON.stringify(props.code, null, 2))

watch(
  [() => props.code, () => props.lang, () => isDark.value],
  async () => {
    await shiki.ensureLanguage(props.lang)
    const highlightedCode = shiki.renderShiki(codeText.value, {
      lang: props.lang,
      theme: isDark.value ? 'vitesse-dark' : 'vitesse-light',
    })
    html.value = highlightedCode.replace(RE_BG_COLOR, 'background-color:transparent;')
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="html" v-html="html" />
  <pre v-else><code>{{ codeText }}</code></pre>
</template>
