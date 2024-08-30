<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  securitySchemes: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="(scheme, name) in props.securitySchemes"
      :key="name"
      class="flex flex-col p-3 gap-2 rounded bg-muted"
    >
      <div class="flex flex-row items-center space-x-2">
        <span class="text-sm font-bold">{{ name }}</span>
      </div>
      <div class="flex flex-col space-y-1 text-sm">
        <span v-if="scheme.type === 'http'">Type: HTTP ({{ scheme.scheme }})</span>
        <span v-if="scheme.type === 'apiKey'">Type: API Key ({{ scheme.in }}: {{ scheme.name }})</span>
        <span v-if="scheme.type === 'openIdConnect'">Type: OpenID Connect ({{ scheme.openIdConnectUrl }})</span>
        <span v-if="scheme.type === 'oauth2'">Type: OAuth2</span>
        <div
          v-if="scheme.type === 'oauth2'"
          class="pl-4"
        >
          <div
            v-for="(url, flow) in scheme.flows"
            :key="flow"
          >
            <span>{{ flow }} Flow:</span>
            <div class="pl-4">
              <span>Authorization URL: {{ url.authorizationUrl }}</span>
              <span>Token URL: {{ url.tokenUrl }}</span>
              <div v-if="url.scopes">
                <span>Scopes:</span>
                <ul class="pl-4">
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
    </div>
  </div>
</template>
