<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { useTheme } from '../../composables/useTheme'
import OAHeading from '../Common/OAHeading.vue'
import OAMarkdown from '../Common/OAMarkdown.vue'
import { Badge } from '../ui/badge/index'
import OADownloadSpec from './OADownloadSpec.vue'

const props = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
})

const themeConfig = useTheme()
const { t } = useI18n()
const info = props.openapi.spec.info ?? {}

const externalDocs = props.openapi.spec.externalDocs ?? {}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col items-start">
      <div class="flex flex-row items-center gap-2">
        <Badge
          v-if="info.version"
          variant="outline"
        >
          v{{ info.version }}
        </Badge>
      </div>

      <OAHeading level="h1">
        {{ info.title ?? t('API Documentation') }}
      </OAHeading>

      <OADownloadSpec
        v-if="!themeConfig.getSpecDisableDownload()"
        class="mt-1"
        :openapi="openapi"
      />
    </div>

    <span v-if="info.summary" class="text-muted-foreground">
      {{ info.summary }}
    </span>

    <OAMarkdown
      v-if="info.description"
      :content="info.description"
      class="mt-4"
    />

    <template v-if="info.contact">
      <OAHeading level="h2">
        {{ t('Contact') }}
      </OAHeading>

      <div class="flex flex-row items-center gap-2">
        <template v-if="info.contact.url">
          <a :href="info.contact.url" :aria-label="info.contact.name ?? t('Contact')">
            {{ info.contact.name ?? t('Contact') }}
          </a>

          <span v-if="info.contact.email" class="text-muted-foreground">/</span>
        </template>

        <a v-if="info.contact.email" :href="`mailto:${info.contact.email}`" :aria-label="info.contact.email">
          {{ info.contact.email }}
        </a>
      </div>
    </template>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div v-if="info.termsOfService">
        <OAHeading level="h2">
          {{ t('Terms of Service') }}
        </OAHeading>

        <a :href="info.termsOfService" :aria-label="info.termsOfService">
          {{ info.termsOfService }}
        </a>
      </div>

      <div v-if="info.license">
        <OAHeading level="h2">
          {{ t('License') }}
        </OAHeading>

        <a :href="info.license.url" :aria-label="info.license.name">
          {{ info.license.name ?? t('License') }}
        </a>
      </div>
    </div>

    <template v-if="Object.keys(externalDocs).length">
      <OAHeading level="h2">
        {{ t('External Documentation') }}
      </OAHeading>

      <a :href="externalDocs.url" :aria-label="externalDocs.description ?? t('External Documentation')">
        {{ externalDocs.description ?? t('External Documentation') }}
      </a>
    </template>
  </div>
</template>
