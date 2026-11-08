<script setup lang="ts">
import { useI18n } from '@byjohann/vue-i18n'
import { Button } from '../ui/button'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
})

const { t } = useI18n()

function reload() {
  window.location.reload()
}
</script>

<template>
  <div role="alert" class="flex flex-row flex-wrap items-center gap-2 text-sm">
    <span>{{ props.message }}</span>
    <Button type="button" variant="outline" size="xs" @click="reload">
      {{ t('Reload page') }}
    </Button>
  </div>
</template>
