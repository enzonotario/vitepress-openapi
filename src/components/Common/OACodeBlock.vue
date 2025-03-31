<script setup>
import { destr } from 'destr'
import { computed, watch } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import { useTheme } from '../../composables/useTheme'
import OACodeBlockShiki from './OACodeBlockShiki.vue'
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

const jsonData = computed(() => {
  return typeof props.code === 'string' ? destr(props.code) : props.code
})

watch(
  [() => props.code, () => props.lang, isDark],
  async () => {
    if (props.lang === 'json') {
      return
    }

    if (!props.disableHtmlTransform) {
      return
    }

    html.value = `<pre><code>${props.code}</code></pre>`
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

    <Suspense v-else-if="!props.disableHtmlTransform">
      <template #default>
        <OACodeBlockShiki
          :code="props.code"
          :lang="props.lang"
          :label="props.label"
          class="!m-0"
        />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>

    <pre v-else>{{ props.code }}</pre>
  </div>
</template>
