<script setup lang="ts">
import { computed, defineProps } from 'vue'

const { response, isDark } = defineProps({
  response: {
    type: Object,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const isJson = /json/i.test(response.type)
const isXml = /xml/i.test(response.type)
const isHtml = /text\/html/i.test(response.type)
const isPlainText = /text\/plain/i.test(response.type)
const isCsv = /text\/csv/i.test(response.type)
const isImage = /^image\//i.test(response.type)
const isAudio = /^audio\//i.test(response.type)
const isDownloadable = /^application\/octet-stream/i.test(response.type)
  || (
    response
    && response.headers
    && (
      /attachment/i.test(response.headers['Content-Disposition'])
      || /attachment/i.test(response.headers['content-disposition'])
      || /download/i.test(response.headers['Content-Disposition'])
      || /download/i.test(response.headers['content-disposition'])
    )
  )

const lang = computed(() => {
  if (isJson) {
    return 'json'
  }
  if (isXml) {
    return 'xml'
  }
  if (isHtml) {
    return 'html'
  }
  if (isPlainText) {
    return 'plaintext'
  }
  if (isCsv) {
    return 'csv'
  }
  return 'plaintext'
})

const label = computed(() => {
  if (isJson) {
    return 'JSON'
  }
  if (isXml) {
    return 'XML'
  }
  if (isHtml) {
    return 'HTML'
  }
  if (isPlainText) {
    return 'Plain Text'
  }
  if (isCsv) {
    return 'CSV'
  }
  return 'Plain Text'
})

const url = computed(() => {
  if (isAudio) {
    try {
      return window.URL ? URL.createObjectURL(response.body) : ''
    } catch (error) {}
  }

  return ''
})

function downloadBlob(blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.URL.revokeObjectURL(url)
}
</script>

<template>
  <div>
    <OACodeBlock
      v-if="isJson || isXml || isHtml || isPlainText || isCsv"
      :code="response.body"
      :lang="lang"
      :label="label"
      :is-dark="isDark"
      :disable-html-transform="response.body.length > 1000"
    />
    <img v-else-if="isImage" :src="response.body" alt="Response Image">
    <audio v-else-if="isAudio" controls class="w-full mt-2">
      <source :src="url" :type="response.type">
      {{ $t('Your browser does not support the audio element.') }}
    </audio>
    <div v-else-if="isDownloadable">
      <button @click="downloadBlob(response.body, 'response_file')">
        {{ $t('Download file') }}
      </button>
    </div>
    <div v-else>
      <p>{{ $t('Unrecognized response type. Raw content:') }}</p>
      <pre class="whitespace-pre-wrap">{{ response.body }}</pre>
    </div>
  </div>
</template>
