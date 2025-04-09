<script setup>
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme'
import OAShiki from './Highlight/OAShiki.vue'
import OAVueJsonPretty from './Highlight/OAVueJsonPretty.vue'

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

const jsonViewerRenderer = computed(() => {
  return themeConfig.getJsonViewerRenderer()
})

const shouldUseVueJsonPretty = computed(() => {
  return props.lang === 'json' && !props.disableHtmlTransform && jsonViewerRenderer.value === 'vue-json-pretty'
})

const shouldUseShiki = computed(() => {
  if (props.disableHtmlTransform) {
    return false
  }

  return props.lang !== 'json' || jsonViewerRenderer.value === 'shiki'
})
</script>

<template>
  <div class="vp-adaptive-theme min-h-16" :class="[`language-${props.lang}`]">
    <button
      title="Copy Code"
      class="copy"
    />
    <span class="lang">{{ props.label }}</span>

    <OAVueJsonPretty v-if="shouldUseVueJsonPretty" :code="props.code" />

    <OAShiki v-else-if="shouldUseShiki" :code="props.code" :lang="props.lang" />

    <pre v-else><code>{{ props.code }}</code></pre>
  </div>
</template>
