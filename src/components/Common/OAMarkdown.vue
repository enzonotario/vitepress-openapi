<script setup>
import markdownit from 'markdown-it'
import { cn } from '../../lib/utils'

const props = defineProps({
  content: {
    type: String,
    required: false,
    default: '',
  },
  class: {
    type: String,
    required: false,
  },
})

const md = markdownit({
  html: true,
  breaks: true,
})
</script>

<template>
  <div
    :class="cn('oa-doc', props.class)"
    v-html="md.render(props.content)"
  />
</template>
