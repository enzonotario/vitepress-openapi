<script setup>
import { computed, ref, watch } from 'vue'
import { useTheme } from '../../composables/useTheme'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  request: {
    type: Object,
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

const samples = ref(props.codeSamples)

const defaultLang = computed(() => {
  const defaultValue = themeConfig.getCodeSamplesDefaultLang()

  if (!samples.value?.find(sample => sample.lang === defaultValue)) {
    return samples.value?.[0]?.lang
  }

  return defaultValue
})

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

watch(() => props.request, loadSamples, { deep: true })
</script>

<template>
  <div>
    <div
      v-if="samples.length"
      class="vp-code-group vp-adaptive-theme mt-0"
    >
      <div class="tabs !m-0">
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
          class="!m-0"
        />
      </div>
    </div>
  </div>
</template>
