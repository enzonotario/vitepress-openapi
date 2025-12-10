<script setup>
import { useMarkdown } from '../../composables/useMarkdown'
import { cn } from '../../lib/utils/utils'

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

const { render } = useMarkdown()
</script>

<template>
  <div
    :class="cn('OAMarkdown oa-doc', props.class)"
    v-html="render(props.content)"
  />
</template>
