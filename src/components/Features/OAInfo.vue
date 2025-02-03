<script setup>
import { inject } from 'vue'
import { getOpenApiInstance } from '../../lib/getOpenApiInstance.js'
import { Badge } from '../ui/badge/index.js'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
  },
  openapi: {
    type: Object,
    required: false,
  },
})

const openapi = props.openapi ?? getOpenApiInstance({
  custom: { spec: props.spec },
  injected: inject('openapi', undefined),
})

const info = openapi.getInfo()

const externalDocs = openapi.getExternalDocs()
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
        {{ info.title ?? $t('API Documentation') }}
      </OAHeading>
    </div>

    <span v-if="info.summary" class="text-gray-600 dark:text-gray-300">
      {{ info.summary }}
    </span>

    <OAMarkdown
      v-if="info.description"
      :content="info.description"
      class="mt-4"
    />

    <template v-if="info.contact">
      <OAHeading level="h2">
        {{ $t('Contact') }}
      </OAHeading>

      <div class="flex flex-row items-center gap-2">
        <template v-if="info.contact.url">
          <a :href="info.contact.url" :aria-label="info.contact.name ?? $t('Contact')">
            {{ info.contact.name ?? $t('Contact') }}
          </a>

          <span v-if="info.contact.email" class="text-gray-400 dark:text-gray-500">/</span>
        </template>

        <a v-if="info.contact.email" :href="`mailto:${info.contact.email}`" :aria-label="info.contact.email">
          {{ info.contact.email }}
        </a>
      </div>
    </template>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div v-if="info.termsOfService">
        <OAHeading level="h2">
          {{ $t('Terms of Service') }}
        </OAHeading>

        <a :href="info.termsOfService" :aria-label="info.termsOfService">
          {{ info.termsOfService }}
        </a>
      </div>

      <div v-if="info.license">
        <OAHeading level="h2">
          {{ $t('License') }}
        </OAHeading>

        <a :href="info.license.url" :aria-label="info.license.name">
          {{ info.license.name ?? $t('License') }}
        </a>
      </div>
    </div>

    <template v-if="Object.keys(externalDocs).length">
      <OAHeading level="h2">
        {{ $t('External Documentation') }}
      </OAHeading>

      <a :href="externalDocs.url" :aria-label="externalDocs.description ?? $t('External Documentation')">
        {{ externalDocs.description ?? $t('External Documentation') }}
      </a>
    </template>
  </div>
</template>
