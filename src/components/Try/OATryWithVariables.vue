<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'
import OAPlaygroundResponse from 'vitepress-openapi/components/Playground/OAPlaygroundResponse.vue'
import OAPlaygroundParameters from 'vitepress-openapi/components/Playground/OAPlaygroundParameters.vue'
import { OARequest } from 'vitepress-openapi'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  isDark: {
    type: Boolean,
    required: true,
  },
  hideEndpoint: {
    type: Boolean,
    default: false,
  },
  parameters: {
    type: Object,
    required: false,
  },
  schema: {
    type: Object,
    required: false,
  },
  securitySchemes: {
    type: Object,
    required: true,
  },
  request: {
    type: Object,
    default: () => (new OARequest()),
  },
})

const emits = defineEmits([
  'update:request',
])

const loading = ref(false)
</script>

<template>
  <div class="flex flex-col space-y-2">
    <OAPlaygroundParameters
      :request="props.request"
      :operation-id="props.operationId"
      :path="props.path"
      :method="props.method"
      :base-url="props.baseUrl"
      :parameters="props.parameters ?? []"
      :security-schemes="props.securitySchemes ?? {}"
      :schema="props.schema"
      :is-dark="props.isDark"
      @update:request="($event) => emits('update:request', $event)"
    />

    <OATryItButton
      :request="props.request"
      :operation-id="props.operationId"
      :path="props.path"
      :method="props.method"
      :base-url="props.baseUrl"
      :is-dark="props.isDark"
      @loading="loading = $event"
    >
      <template #response="response">
        <OAPlaygroundResponse
          :response="response.response"
          :is-dark="response.isDark"
        />
      </template>
    </OATryItButton>
  </div>
</template>
