<script setup>
import { useI18n } from '@byjohann/vue-i18n'

const { t } = useI18n()
</script>

<template>
  <span class="text-sm text-muted-foreground text-center">
    {{ t('Powered by') }} <a
      href="https://github.com/enzonotario/vitepress-openapi"
      target="_blank"
      class="text-primary-foreground"
    >
      VitePress OpenAPI
    </a>
  </span>
</template>
