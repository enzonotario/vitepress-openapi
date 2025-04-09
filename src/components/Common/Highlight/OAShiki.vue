<script setup>
import { ref, watch } from 'vue'
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

const themeConfig = useTheme()

const isDark = themeConfig.isDark

const shiki = useShiki()

const html = ref(null)

watch(
  [() => props.code, () => isDark.value],
  async () => {
    const codeToHighlight = typeof props.code === 'string' ? props.code : JSON.stringify(props.code, null, 2)
    await shiki.initShiki()
    const highlightedCode = shiki.renderShiki(codeToHighlight, {
      lang: props.lang,
      theme: isDark.value ? 'vitesse-dark' : 'vitesse-light',
    })
    html.value = highlightedCode.replace(/background-color:[^;]+;/g, 'background-color:transparent;')
  },
  { immediate: true },
)
</script>

<template>
  <div v-html="html" />
</template>
