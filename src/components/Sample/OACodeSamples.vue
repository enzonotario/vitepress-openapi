<script setup lang="ts">
import type { LanguageConfig } from '../../composables/useTheme'
import type { OperationData } from '@/lib/operation/operationData'
import { inject, ref, watch } from 'vue'
import { OPERATION_DATA_KEY } from '@/lib/operation/operationData'
import { useShiki } from '../../composables/useShiki'
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

const shiki = useShiki()

const availableLanguages = themeConfig.getCodeSamplesAvailableLanguages()

const generator = themeConfig.getCodeSamplesGenerator()

const samples = ref<Sample[]>([])

const activeSampleKey = ref('')

// Highlighting is costly (e.g. PHP), so a tab is highlighted only once it has been shown.
const shownSampleKeys = ref(new Set<string>())

watch(activeSampleKey, (key) => {
  if (key) {
    shownSampleKeys.value.add(key)
  }
}, { immediate: true })

const radioGroupName = `group-${props.operationId}`

watch(operationData.playground.request, async (playgroundRequest, _, onInvalidate) => {
  let cancelled = false
  onInvalidate(() => {
    cancelled = true
  })

  if (!availableLanguages || !generator) {
    return
  }

  const nextSamples = await Promise.all(
    availableLanguages.map(async (langConfig) => {
      const { lang, target, client, highlighter } = langConfig
      const key = [lang, target, client]
        .filter(Boolean)
        .join('-')
      const tabId = `tab-${props.operationId}-${key}`

      try {
        const source = await generator(langConfig, playgroundRequest)
        if (!source) {
          throw new Error('Code generator returned empty result.')
        }

        return {
          ...langConfig,
          key,
          tabId,
          highlighter: highlighter || 'plain',
          source,
        }
      }
      catch (error) {
        console.error(`Failed to generate code sample for '${lang}'`, { langConfig, error })
        return {
          ...langConfig,
          key,
          tabId,
          highlighter: 'shell',
          source: `// Failed to generate sample.\n// Please check the console for details.`,
        }
      }
    }),
  )

  // Guard against stale data due to rapid updates of `operationData.playground.request`
  if (cancelled) {
    return
  }

  let nextActiveKey = activeSampleKey.value
  if (!nextActiveKey || !nextSamples.some(s => s.key === nextActiveKey)) {
    const defaultLang = themeConfig.getCodeSamplesDefaultLang()
    nextActiveKey = (nextSamples.find(s => s.lang === defaultLang) || nextSamples[0])?.key ?? ''
  }

  // Preload only the languages of tabs that are highlighted.
  const uniqueHighlighters = [...new Set(nextSamples
    .filter(s => s.key === nextActiveKey || shownSampleKeys.value.has(s.key))
    .map(s => s.highlighter)
    .filter(Boolean))]
  await Promise.all(uniqueHighlighters.map(lang => shiki.ensureLanguage(lang)))

  if (cancelled) {
    return
  }

  samples.value = nextSamples
  activeSampleKey.value = nextActiveKey
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
      <div class="tabs m-0!">
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
          :disable-html-transform="!shownSampleKeys.has(sample.key)"
          :class="{ active: activeSampleKey === sample.key }"
          class="m-0!"
        />
      </div>
    </div>
  </div>
</template>
