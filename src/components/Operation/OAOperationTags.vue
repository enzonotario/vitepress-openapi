<script setup lang="ts">
import { useTheme } from '../../composables/useTheme'
import { Badge } from '../ui/badge'

const props = defineProps<{
  tags: string[]
}>()

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
