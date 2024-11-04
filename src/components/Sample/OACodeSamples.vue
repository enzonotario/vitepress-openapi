<script setup>
import { useTheme } from 'vitepress-openapi'
import { useCodeSamples } from 'vitepress-openapi/composables/useCodeSamples'
import { generateCodeSample } from 'vitepress-openapi/lib/codeSamples/generateCodeSample'
import { OARequest } from 'vitepress-openapi/lib/codeSamples/request'
import { computed } from 'vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
  request: {
    type: Object,
    default: () => (new OARequest()),
  },
})

const availableLanguages = useCodeSamples().availableLanguages

const configuredLanguages = useTheme().getCodeSamplesLangs()

const samples = computed(() => availableLanguages
  .filter((availableLanguage) => {
    return configuredLanguages.includes(availableLanguage.lang)
  })
  .map((availableLanguage) => {
    return {
      ...availableLanguage,
      source: generateCodeSample(availableLanguage.lang, {
        ...props.request,
        headers: {
          ...props.request.headers,
          ...(!props.request.headers?.['Content-Type'] ? { 'Content-Type': 'application/json' } : {}),
        },
      }),
    }
  }),
)
const defaultLang = useTheme().getCodeSamplesDefaultLang()
</script>

<template>
  <div class="vp-code-group vp-adaptive-theme">
    <div class="tabs">
      <template v-for="sample in samples" :key="sample.lang">
        <input
          :id="`tab-${props.operationId}-${sample.lang}`"
          type="radio"
          :name="`group-${props.operationId}`"
          :checked="sample.lang === 'curl'"
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
        :is-dark="props.isDark"
        :class="{ active: sample.lang === defaultLang }"
        class="!mb-0"
      />
    </div>
  </div>
</template>
