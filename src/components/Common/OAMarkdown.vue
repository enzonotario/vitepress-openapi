<script setup>
import markdownit from 'markdown-it'
import { useTheme } from '../../composables/useTheme'
import { operationLink } from '../../lib/markdown/operationLink'
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

const theme = useTheme()
const operationLinkConfig = theme.getOperationLinkConfig()

const md = (markdownit({
  html: true,
  breaks: true,
})).use(operationLink, operationLinkConfig)
</script>

<template>
  <div
    :class="cn('oa-doc', props.class)"
    v-html="md.render(props.content)"
  />
</template>
