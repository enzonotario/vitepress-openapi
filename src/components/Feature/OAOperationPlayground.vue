<script setup lang="ts">
import OAHeading from '../Common/OAHeading.vue'
import { OAOperationContext } from '../index'
import OAPathEndpoint from '../Path/OAPathEndpoint.vue'
import OAPlayground from '../Playground/OAPlayground.vue'
import OACodeSamples from '../Sample/OACodeSamples.vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  openapi: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <OAOperationContext
    :operation-id="props.operationId"
    :openapi="props.openapi"
  >
    <template #default="operationContext">
      <div class="flex flex-col gap-6">
        <OAHeading level="h1">
          {{ $t('Playground') }}
        </OAHeading>

        <OAPathEndpoint
          :base-url="operationContext.operationData.playground.selectedServer.value"
          :path="operationContext.path"
          :method="operationContext.method"
        />

        <OAPlayground
          :operation-id="props.operationId"
          :path="operationContext.path"
          :method="operationContext.method"
          :parameters="operationContext.parameters"
          :request-body="operationContext.requestBody"
          :security-ui="operationContext.securityUi"
          :servers="operationContext.servers"
        />

        <OAHeading level="h1">
          {{ $t('Samples') }}
        </OAHeading>

        <OACodeSamples
          :operation-id="props.operationId"
          :code-samples="operationContext.codeSamples"
        />
      </div>
    </template>
  </OAOperationContext>
</template>
