<script setup>
import { ref, watch } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { OARequest } from '../../lib/codeSamples/request'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  request: {
    type: Object,
    default: () => (new OARequest()),
  },
  codeSamples: {
    type: Object,
    default: () => ({}),
  },
})

const themeConfig = useTheme()

const availableLanguages = themeConfig.getCodeSamplesAvailableLanguages()

const configuredLanguages = themeConfig.getCodeSamplesLangs()

const generator = themeConfig.getCodeSamplesGenerator()

const defaultLang = themeConfig.getCodeSamplesDefaultLang()

const samples = ref(props.codeSamples)

const loadSamples = async () => {
  samples.value = await Promise.all(
    availableLanguages
      .filter(availableLanguage => configuredLanguages.includes(availableLanguage.lang))
      .map(async availableLanguage => ({
        ...availableLanguage,
        source: await generator(availableLanguage.lang, {
          ...props.request,
          headers: {
            ...(themeConfig.getCodeSamplesDefaultHeaders() || {}),
            ...props.request.headers,
          },
        }),
      }
      )),
  )
}

watch(() => props.request, loadSamples, { deep: true, immediate: true })
</script>

<template>
  <div>
    <div
      v-if="samples.length"
      class="vp-code-group vp-adaptive-theme mt-0"
    >
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
  </div>
</template>
