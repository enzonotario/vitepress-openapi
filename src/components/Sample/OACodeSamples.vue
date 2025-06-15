<script setup lang="ts">
import type { OperationData } from '../../lib/operationData'
import { computed, inject, ref, watch } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { OPERATION_DATA_KEY } from '../../lib/operationData'
import OACodeBlock from '../Common/OACodeBlock.vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  codeSamples: {
    type: Object,
    default: () => ({}),
  },
})

const operationData = inject(OPERATION_DATA_KEY) as OperationData

const themeConfig = useTheme()

const availableLanguages = themeConfig.getCodeSamplesAvailableLanguages()

const configuredLanguages = themeConfig.getCodeSamplesLangs()

const generator = themeConfig.getCodeSamplesGenerator()

const samples = ref(typeof props.codeSamples === 'object' && !Array.isArray(props.codeSamples)
  ? Object.entries(props.codeSamples).map(([lang, source]) => ({
      lang,
      source,
    }))
  : props.codeSamples)

const defaultLang = computed(() => {
  const defaultValue = themeConfig.getCodeSamplesDefaultLang()

  if (!samples.value?.find(sample => sample.lang === defaultValue)) {
    return samples.value?.[0]?.lang
  }

  return defaultValue
})

const activeSample = ref(samples.value?.find(sample => sample.lang === defaultLang.value)?.lang)

watch(operationData.playground.request, async (request) => {
  if (!availableLanguages || !configuredLanguages || !generator) {
    return
  }

  samples.value = await Promise.all(
    availableLanguages
      .filter(availableLanguage => configuredLanguages.includes(availableLanguage.lang))
      .map(async availableLanguage => ({
        ...availableLanguage,
        source: await generator(availableLanguage.lang, request),
      })),
  )
}, {
  deep: true,
  immediate: true,
})
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
            @change="activeSample = sample.lang"
          >
          <label
            :for="`tab-${props.operationId}-${sample.lang}`"
            :data-title="sample.icon"
          >{{ sample.label || sample.lang }}</label>
        </template>
      </div>

      <div class="blocks">
        <OACodeBlock
          v-for="sample in samples"
          :key="sample.lang"
          :code="sample.source"
          :lang="sample.highlighter"
          :label="sample.label"
          :active="activeSample === sample.lang"
          :class="{ active: sample.lang === defaultLang }"
          class="!m-0"
        />
      </div>
    </div>
  </div>
</template>
