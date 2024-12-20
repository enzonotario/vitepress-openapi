<script setup lang="ts">
import { computed, defineProps } from 'vue'
import OAParameterExamples from '../Parameter/OAParameterExamples.vue'
import OAParameterAttribute from '../Parameter/OAParameterAttribute.vue'

const { scheme, name } = defineProps({
  name: {
    type: String,
    required: true,
  },
  scheme: {
    type: Object,
    required: true,
  },
})

const typeValue = computed(() => {
  if (scheme.type === 'http') {
    return `HTTP (${scheme.scheme})`
  }

  if (scheme.type === 'apiKey') {
    return `API Key (${scheme.in}: ${scheme.name})`
  }

  if (scheme.type === 'openIdConnect') {
    return `OpenID Connect (${scheme.openIdConnectUrl})`
  }

  if (scheme.type === 'oauth2') {
    return 'OAuth2'
  }

  return ''
})
</script>

<template>
  <div class="flex flex-col p-3 gap-2 rounded bg-muted">
    <div class="flex flex-col gap-2">
      <div class="flex flex-row items-center gap-2">
        <span class="text-sm font-bold">{{ name }}</span>
      </div>

      <OAMarkdown
        v-if="scheme.description"
        :content="scheme.description"
        class="text-sm text-gray-800 dark:text-gray-100"
      />
    </div>

    <div class="flex flex-col gap-2">
      <OAParameterAttribute v-if="scheme.type !== 'oauth2'" :name="$t('Type')" bold-name :value="typeValue" />

      <div
        v-if="scheme.type === 'oauth2'"
        class="pl-2"
      >
        <div
          v-for="(url, flow) in scheme.flows"
          :key="flow"
        >
          <span>{{ flow }} Flow:</span>
          <div class="pl-2">
            <span>Authorization URL: {{ url.authorizationUrl }}</span>
            <span>Token URL: {{ url.tokenUrl }}</span>
            <div v-if="url.scopes">
              <span>Scopes:</span>
              <ul class="pl-2">
                <li
                  v-for="(description, scope) in url.scopes"
                  :key="scope"
                >
                  {{ scope }}: {{ description }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <OAParameterExamples :property="scheme" />
  </div>
</template>
