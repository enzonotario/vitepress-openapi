<script setup lang="ts">
import { computed, inject, ref, useSlots } from 'vue'
import OAHeaderBadges from 'vitepress-openapi/components/Common/OAHeaderBadges.vue'
import { OARequest, getOpenApiInstance } from 'vitepress-openapi'
import type { OperationSlot } from 'vitepress-openapi/types.js'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  spec: {
    type: Object,
    required: false,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
  prefixHeadings: {
    // Whether to add prefixes to component headings (for the One Page view)
    type: Boolean,
    default: false,
  },
  hideDefaultFooter: {
    /**
     * @deprecated Use `hideBranding` instead
     */
    type: Boolean,
    default: undefined,
  },
  hideBranding: {
    type: Boolean,
    default: (props) => {
      if (props.hideBranding === undefined && props.hideDefaultFooter !== undefined) {
        console.warn(
          '`hideDefaultFooter` is deprecated. Use `hideBranding` instead.',
        )

        return props.hideDefaultFooter
      }

      return false
    },
  },
})

defineSlots<{
  [x in OperationSlot]: (props: OperationSlot) => any
}>()

const openapi = props.openapi ?? getOpenApiInstance({
  custom: { spec: props.spec },
  injected: inject('openapi', undefined),
})

const slots = useSlots()

const headingPrefix = computed(() => {
  if (!props.prefixHeadings) {
    return null
  }

  return props.operationId
})

const request = ref(new OARequest(
  `${openapi.getBaseUrl()}${openapi.getOperationPath(props.operationId)}`,
  openapi.getOperationMethod(props.operationId)?.toUpperCase(),
  {},
  {},
  {},
))

function hasSlot(name) {
  return slots[name] !== undefined
}
</script>

<template>
  <OAPath
    v-if="props.operationId"
    :id="props.operationId"
    :openapi="openapi"
  >
    <template
      v-if="hasSlot('header')"
      #header="header"
    >
      <slot
        name="header"
        v-bind="header"
      />
    </template>
    <template
      v-else
      #header="header"
    >
      <div class="flex flex-col">
        <OAHeaderBadges
          :operation="header.operation"
          :deprecated="header.deprecated"
        />

        <OAHeading
          :id="headingPrefix"
          level="h1"
          :class="{
            'line-through': header.deprecated,
          }"
        >
          {{ header.operation.summary }}
        </OAHeading>
      </div>
    </template>

    <template
      v-if="hasSlot('description')"
      #description="description"
    >
      <slot
        name="description"
        v-bind="description"
      />
    </template>
    <template
      v-else
      #description="description"
    >
      <OAMarkdown
        v-if="description.operation.description"
        :content="description.operation.description"
        class="description"
      />
    </template>

    <template
      v-if="hasSlot('security')"
      #security="security"
    >
      <slot
        name="security"
        v-bind="security"
      />
    </template>
    <template
      v-else
      #security="security"
    >
      <OASecurity
        v-if="Object.keys(security.securitySchemes).length"
        :security-schemes="security.securitySchemes"
        :heading-prefix="headingPrefix"
      />
    </template>

    <template
      v-if="hasSlot('parameters')"
      #parameters="parameters"
    >
      <slot
        name="parameters"
        v-bind="parameters"
      />
    </template>
    <template
      v-else
      #parameters="parameters"
    >
      <OAHeading
        level="h2"
        :prefix="headingPrefix"
      >
        {{ $t('Parameters') }}
      </OAHeading>

      <OAParameters
        :operation-id="props.operationId"
        :parameters="parameters.parameters"
      />
    </template>

    <template
      v-if="hasSlot('request-body')"
      #request-body="requestBody"
    >
      <slot
        name="request-body"
        v-bind="requestBody"
      />
    </template>
    <template
      v-else
      #request-body="requestBody"
    >
      <OAHeading
        level="h2"
        :prefix="headingPrefix"
      >
        {{ $t('Request Body') }}
      </OAHeading>

      <OARequestBody
        :operation-id="requestBody.operationId"
        :schema="requestBody.schema"
        :is-dark="isDark"
      />
    </template>

    <template
      v-if="hasSlot('responses')"
      #responses="responses"
    >
      <slot
        name="responses"
        v-bind="responses"
      />
    </template>
    <template
      v-else
      #responses="responses"
    >
      <OAResponses
        :operation-id="responses.operationId"
        :responses="responses.responses"
        :response-type="responses.responseType"
        :is-dark="isDark"
        :heading-prefix="headingPrefix"
      />
    </template>

    <template
      v-if="hasSlot('path')"
      #path="path"
    >
      <slot
        name="path"
        v-bind="path"
      />
    </template>
    <template
      v-else
      #path="path"
    >
      <OAPathEndpoint
        :path="path.path"
        :method="path.method"
        :base-url="path.baseUrl"
        :hide-base-url="path.hideBaseUrl"
        :deprecated="path.deprecated"
      />
    </template>

    <template
      v-if="hasSlot('try-it')"
      #try-it="tryIt"
    >
      <slot
        name="try-it"
        v-bind="tryIt"
      />
    </template>
    <template
      v-else
      #try-it="tryIt"
    >
      <ClientOnly>
        <OATryWithVariables
          v-model:request="request"
          :operation-id="tryIt.operationId"
          :path="tryIt.path"
          :method="tryIt.method"
          :base-url="tryIt.baseUrl"
          :parameters="tryIt.parameters"
          :schema="tryIt.schema"
          :security-schemes="tryIt.securitySchemes"
          :is-dark="isDark"
        />
      </ClientOnly>
    </template>

    <template
      v-if="hasSlot('code-samples')"
      #code-samples="codeSamples"
    >
      <slot
        name="code-samples"
        v-bind="codeSamples"
      />
    </template>
    <template
      v-else
      #code-samples="codeSamples"
    >
      <OAHeading
        level="h2"
        :prefix="headingPrefix"
      >
        {{ $t('Samples') }}
      </OAHeading>

      <OACodeSamples
        :operation-id="codeSamples.operationId"
        :path="codeSamples.path"
        :method="codeSamples.method"
        :base-url="codeSamples.baseUrl"
        :request="request"
        :is-dark="isDark"
      />
    </template>

    <template
      v-if="hasSlot('branding')"
      #branding="branding"
    >
      <slot
        name="branding"
        v-bind="branding"
      />
    </template>
    <template
      v-else-if="!props.hideBranding"
      #branding="branding"
    >
      <OAFooter v-bind="branding" />
    </template>

    <template
      v-if="hasSlot('footer')"
      #footer="footer"
    >
      <slot
        name="footer"
        v-bind="footer"
      />
    </template>
  </OAPath>
</template>
