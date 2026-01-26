<script setup lang="ts">
import type { OperationData } from '@/lib/operation/operationData'
import type { LanguageConfig } from '../../composables/useTheme'
import { OPERATION_DATA_KEY } from '@/lib/operation/operationData'
import { inject, ref, watch } from 'vue'
import { useTheme } from '../../composables/useTheme'
import OACodeBlock from '../Common/OACodeBlock.vue'

type Sample = LanguageConfig & {
  key: string
  tabId: string
  highlighter: string
  source: string
}

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
})

const operationData = inject(OPERATION_DATA_KEY) as OperationData

const themeConfig = useTheme()

const availableLanguages = themeConfig.getCodeSamplesAvailableLanguages()

const generator = themeConfig.getCodeSamplesGenerator()

const samples = ref<Sample[]>([])

const activeSampleKey = ref('')

const radioGroupName = `group-${props.operationId}`

watch(operationData.playground.request, async (request) => {
  if (!availableLanguages || !generator) {
    return
  }

  samples.value = await Promise.all(
    availableLanguages.map(async (langConfig) => {
      const key = langConfig.target && langConfig.client
        ? `${langConfig.target}-${langConfig.client}`
        : langConfig.lang
      return {
        ...langConfig,
        key,
        highlighter: langConfig.highlighter || 'plain',
        tabId: `tab-${props.operationId}-${key}`,
        source: await generator(langConfig, request),
      }
    }),
  )

  if (!activeSampleKey.value || !samples.value.some(s => s.key === activeSampleKey.value)) {
    const defaultLang = themeConfig.getCodeSamplesDefaultLang()
    const defaultSample = samples.value.find(s => s.lang === defaultLang) || samples.value[0]
    if (defaultSample) {
      activeSampleKey.value = defaultSample.key
    }
  }
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
        <template v-for="sample in samples" :key="sample.key">
          <input
            :id="sample.tabId"
            type="radio"
            :name="radioGroupName"
            :checked="activeSampleKey === sample.key"
            @change="activeSampleKey = sample.key"
          >
          <label
            :for="sample.tabId"
            :data-title="sample.icon"
          >{{ sample.label }}</label>
        </template>
      </div>

      <div class="blocks">
        <OACodeBlock
          v-for="sample in samples"
          :key="sample.key"
          :code="sample.source"
          :lang="sample.highlighter"
          :label="sample.label"
          :active="activeSampleKey === sample.key"
          :class="{ active: activeSampleKey === sample.key }"
          class="!m-0"
        />
      </div>
    </div>
  </div>
</template>
