<script setup lang="ts">
import { useI18n } from '@byjohann/vue-i18n'
import { computed, defineProps, onBeforeUnmount, ref, watch } from 'vue'
import { getDownloadFileNameFromContentDisposition } from '../../lib/playground/getDownloadFileName'
import OACodeBlock from '../Common/OACodeBlock.vue'

interface ResponseType {
  type: string
  body: any
  headers?: Record<string, string>
}

const props = defineProps<{
  response: ResponseType
}>()

const { t } = useI18n()

const isType = (regex: RegExp) => computed(() => regex.test(props.response.type))

const isHeader = (header: string, regex: RegExp) =>
  props.response.headers
  && Object.entries(props.response.headers).some(
    ([k, v]) => k.toLowerCase() === header && regex.test(v),
  )

const isJson = isType(/json/i)
const isXml = isType(/xml/i)
const isHtml = isType(/text\/html/i)
const isPlainText = isType(/text\/plain/i)
const isCsv = isType(/text\/csv/i)
const isImage = isType(/^image\//i)
const isAudio = isType(/^audio\//i)
const isDownloadable = computed(() =>
  /^application\/octet-stream/i.test(props.response.type)
  || isHeader('content-disposition', /attachment|download/i),
)

const lang = computed(() => {
  if (isJson.value) {
    return 'json'
  }
  if (isXml.value) {
    return 'xml'
  }
  if (isHtml.value) {
    return 'html'
  }
  if (isPlainText.value) {
    return 'plaintext'
  }
  if (isCsv.value) {
    return 'csv'
  }
  return 'plaintext'
})

const label = computed(() => {
  if (isJson.value) {
    return 'JSON'
  }
  if (isXml.value) {
    return 'XML'
  }
  if (isHtml.value) {
    return 'HTML'
  }
  if (isPlainText.value) {
    return 'Plain Text'
  }
  if (isCsv.value) {
    return 'CSV'
  }
  return 'Plain Text'
})

const audioUrl = ref<string>('')

watch(
  () => props.response,
  () => {
    if (isAudio.value && props.response.body instanceof Blob) {
      audioUrl.value = URL.createObjectURL(props.response.body)
    } else {
      audioUrl.value = ''
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
})

const disableHtmlTransform = computed(
  () => props.response.body && JSON.stringify(props.response.body).length > 1000,
)

const getHeader = (name: string): string | null => {
  if (!props.response.headers) {
    return null
  }
  const entry = Object.entries(props.response.headers).find(([k]) => k.toLowerCase() === name.toLowerCase())
  return entry ? entry[1] : null
}

const downloadFileName = computed<string>(() => {
  const cd = getHeader('content-disposition')
  return getDownloadFileNameFromContentDisposition(cd, 'response_file')
})

const downloadBlob = (data: any, fileName: string) => {
  let blob: Blob
  if (data instanceof Blob) {
    blob = data
  } else if (typeof data === 'string') {
    blob = new Blob([data], { type: 'application/octet-stream' })
  } else {
    blob = new Blob([JSON.stringify(data)], { type: 'application/octet-stream' })
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <OACodeBlock
      v-if="isJson || isXml || isHtml || isPlainText || isCsv"
      :code="props.response.body"
      :lang="lang"
      :label="label"
      :disable-html-transform="disableHtmlTransform"
      active
      class="!m-0"
    />
    <img
      v-else-if="isImage"
      :src="props.response.body"
      :alt="t('Response Image')"
      style="max-width: 100%;"
    >
    <audio
      v-else-if="isAudio"
      controls
      class="w-full mt-2"
      :aria-label="t('Audio response')"
    >
      <source :src="audioUrl" :type="props.response.type">
      {{ t('Your browser does not support the audio element.') }}
    </audio>
    <div v-else-if="isDownloadable">
      <button
        type="button"
        aria-label="Download file"
        @click="downloadBlob(props.response.body, downloadFileName)"
      >
        {{ t('Download file') }}
      </button>
    </div>
    <div v-else>
      <p>{{ t('Unrecognized response type. Raw content:') }}</p>
      <pre class="whitespace-pre-wrap">{{ props.response.body }}</pre>
    </div>
  </div>
</template>
