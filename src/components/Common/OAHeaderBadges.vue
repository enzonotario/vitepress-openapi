<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { computed, defineProps } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { Badge } from '../ui/badge'

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

const { t } = useI18n()

const operationBadges = computed(() => themeConfig.getOperationBadges().filter((badge) => {
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
    >
      <template v-if="badge === 'deprecated'">
        {{ t('Deprecated') }}
      </template>

      <template v-else-if="badge === 'operationId'">
        {{ t('operation.badgePrefix.operationId') }}{{ operation.operationId }}
      </template>
    </Badge>
  </div>
</template>
