<script setup>
import { computed } from 'vue'
import { OARequest } from '../../lib/codeSamples/request'
import { useTheme } from '../../composables/useTheme'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  request: {
    type: Object,
    default: () => (new OARequest()),
  },
})

const themeConfig = useTheme()

const availableLanguages = themeConfig.getCodeSamplesAvailableLanguages()

const configuredLanguages = themeConfig.getCodeSamplesLangs()

const generator = themeConfig.getCodeSamplesGenerator()

const samples = computed(() => availableLanguages
  .filter((availableLanguage) => {
    return configuredLanguages.includes(availableLanguage.lang)
  })
  .map((availableLanguage) => {
    return {
      ...availableLanguage,
      source: generator(availableLanguage.lang, {
        ...props.request,
        headers: {
          ...(themeConfig.getCodeSamplesDefaultHeaders() || {}),
          ...props.request.headers,
        },
      }),
    }
  }),
)
const defaultLang = themeConfig.getCodeSamplesDefaultLang()
</script>

<template>
  <div class="vp-code-group vp-adaptive-theme">
    <div class="tabs">
      <template v-for="sample in samples" :key="sample.lang">
        <input
          :id="`tab-${props.operationId}-${sample.lang}`"
          type="radio"
          :name="`group-${props.operationId}`"
          :checked="sample.lang === defaultLang"
        >
        <label :for="`tab-${props.operationId}-${sample.lang}`">{{ sample.label || sample.lang }}</label>
      </template>
    </div>

    <div class="blocks">
      <OACodeBlock
        v-for="sample in samples"
        :key="sample.lang"
        :code="sample.source"
        :lang="sample.highlighter"
        :label="sample.label"
        :class="{ active: sample.lang === defaultLang }"
        class="!mb-0"
      />
    </div>
  </div>
</template>
