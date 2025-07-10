<script setup lang="ts">
import { useI18n } from '@byjohann/vue-i18n'
import yaml from 'js-yaml'
import { Badge } from '../ui/badge/index'

const props = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
})

const { t } = useI18n()

function downloadSpec(format: 'json' | 'yaml'): void {
  try {
    const originalSpec = props.openapi.getOriginalSpec()

    if (!originalSpec) {
      console.warn('No OpenAPI Document available for download.')
      return
    }

    const content = format === 'json'
      ? JSON.stringify(originalSpec, null, 2)
      : yaml.dump(originalSpec)

    const mimeType = format === 'json'
      ? 'application/json'
      : 'application/yaml'

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url

    const title = (props.openapi.spec.info?.title || 'openapi')
      .replace(/[^\w\-]/g, '_')
      .toLowerCase()

    a.download = `${title}.${format}`

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error(`Error downloading OpenAPI spec as ${format}:`, error)
  }
}
</script>

<template>
  <div class="download-container group relative">
    <a
      href="#"
      class="download-button relative flex items-center gap-2 !no-underline"
      aria-label="Download OpenAPI Document as JSON"
      @click.prevent="downloadSpec('json')"
    >
      <span class="underline mr-2">{{ t('Download OpenAPI Document') }}</span>
      <Badge variant="outline" class="hidden group-hover:inline-block">JSON</Badge>
    </a>

    <a
      href="#"
      class="download-button yaml-button absolute hidden group-hover:flex items-center gap-2 !no-underline"
      aria-label="Download OpenAPI Document as YAML"
      @click.prevent="downloadSpec('yaml')"
    >
      <span class="underline mr-2">{{ t('Download OpenAPI Document') }}</span>
      <Badge variant="outline">YAML</Badge>
    </a>
  </div>
</template>

<style scoped>
.download-container:has(:focus-visible):before,
.download-container:hover:before {
  content: '';
  width: calc(100% + 1.5rem);
  height: calc(200% + 1.5rem);
  pointer-events: none;
  position: absolute;
  top: -0.5rem;
  left: -0.5rem;
  z-index: 1;
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-border);

  @apply rounded dark:shadow-none border;
}

.download-button {
  width: calc(100% + 0.5rem);
  z-index: 2;
  line-height: 1.625;
}

.download-button:before {
  content: '';
  position: absolute;
  top: -0.25rem;
  left: -0.25rem;
  width: calc(100% + 0.5rem);
  height: calc(100% + 0.5rem);
  z-index: -1;
}

.download-button:hover:before {
  background-color: var(--vp-c-bg-alt);
  @apply rounded;
}

.yaml-button {
  top: 100%;
  left: 0;
  width: calc(100% + 0.5rem);
  margin-top: 0.5rem;
  z-index: 2;
}
</style>
