<script setup lang="ts">
import { Badge } from '../ui/badge'
import { useTheme } from '../../composables/useTheme'

const props = defineProps({
  tags: {
    type: Array,
    required: true,
  },
})

const themeConfig = useTheme()

const prefix = themeConfig.getTagsLinkPrefix()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <a
      v-for="(tag, index) in props.tags"
      :key="index"
      :href="`${prefix}${tag}`"
      :aria-label="$t('tags.goTo', { tag })"
    >
      <Badge variant="outline">
        {{ tag }}
      </Badge>
    </a>
  </div>
</template>
