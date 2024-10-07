<script setup>
import { computed, defineProps } from 'vue'
import { useTheme } from 'vitepress-openapi'
import { Badge } from 'vitepress-openapi/components/ui/badge'

const { deprecated } = defineProps({
  operation: {
    type: Object,
    required: true,
  },
  deprecated: {
    type: Boolean,
    required: false,
  },
})

const themeConfig = useTheme()

const operationBadges = computed(() => [...themeConfig.getOperationBadges().value].filter((badge) => {
  if (badge === 'deprecated' && !deprecated) {
    return false
  }

  return true
}))
</script>

<template>
  <div class="flex flex-row gap-2">
    <Badge
      v-for="badge in operationBadges"
      :key="badge"
      variant="outline"
      class="gap-1"
    >
      <template v-if="badge === 'deprecated'">
        {{ $t('Deprecated') }}
      </template>

      <template v-else-if="badge === 'operationId'">
        <span>{{ $t('operation.badgePrefix.operationId') }}</span>
        <span>{{ operation.operationId }}</span>
      </template>
    </Badge>
  </div>
</template>
