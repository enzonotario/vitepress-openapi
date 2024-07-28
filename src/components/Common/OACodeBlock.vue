<script setup>
import { codeToHtml } from 'shikiji'
import { ref, watch } from 'vue'

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

watch(
  [() => props.code, () => props.lang, () => props.isDark],
  async () => {
    if (props.disableHtmlTransform) {
      html.value = props.code
      return
    }

    html.value = await codeToHtml(props.code, {
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
  <div class="vp-adaptive-theme" :class="[`language-${props.lang}`]">
    <button title="Copy Code" class="copy" />
    <span class="lang">{{ props.label }}</span>
    <div v-if="html && !props.disableHtmlTransform" class="vp-adaptive-theme" v-html="html" />
    <pre v-else>{{ props.code }}</pre>
  </div>
</template>
