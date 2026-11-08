<script setup>
import { cn } from '@/lib/utils/utils'
import { vHydratableHtml } from '@/lib/utils/vHydratableHtml'
import { useMarkdown } from '../../composables/useMarkdown'

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
    v-hydratable-html="render(props.content)"
    :class="cn('OAMarkdown oa-doc', props.class)"
  />
</template>
