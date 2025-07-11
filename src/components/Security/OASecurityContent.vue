<script setup lang="ts">
import { useI18n } from '@byjohann/vue-i18n'
import { computed, defineProps } from 'vue'
import OACodeValue from '../Common/OACodeValue.vue'
import OAMarkdown from '../Common/OAMarkdown.vue'
import OAParameterAttribute from '../Parameter/OAParameterAttribute.vue'
import OAParameterExamples from '../Parameter/OAParameterExamples.vue'

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

const { t } = useI18n()

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
        class="text-sm"
      />
    </div>

    <div class="flex flex-col gap-2">
      <OAParameterAttribute v-if="scheme.type !== 'oauth2'" :name="t('Type')" bold-name :value="typeValue" />

      <div
        v-if="scheme.type === 'oauth2'"
        class="pl-2"
      >
        <div
          v-for="(url, flow) in scheme.flows"
          :key="flow"
        >
          <details>
            <summary class="!my-1 cursor-pointer hover:text-[var(--vp-c-brand-1)]">
              {{ flow }} Flow
            </summary>

            <div class="pl-2 flex flex-col gap-1">
              <div v-if="url.authorizationUrl" class="flex flex-wrap gap-2">
                <span class="text-sm">{{ t('Authorization URL') }}</span>
                <OACodeValue :value="url.authorizationUrl" />
              </div>

              <div v-if="url.tokenUrl" class="flex flex-wrap gap-2">
                <span class="text-sm">{{ t('Token URL') }}</span>
                <OACodeValue :value="url.tokenUrl" />
              </div>

              <div v-if="url.scopes">
                <span class="text-sm">Scopes:</span>
                <ul class="pl-2 !my-0">
                  <li
                    v-for="(description, scope) in url.scopes"
                    :key="scope"
                  >
                    <OACodeValue :value="scope" />
                    <span class="ml-2 text-sm">{{ description }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>

    <OAParameterExamples :property="scheme" />
  </div>
</template>
