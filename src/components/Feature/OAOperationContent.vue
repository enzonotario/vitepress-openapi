<script setup lang="ts">
import type { OperationSlot } from '../../types'
import { computed } from 'vue'
import OAHeaderBadges from '../Common/OAHeaderBadges.vue'
import OAOperationTags from '../Operation/OAOperationTags.vue'
import OAPlayground from '../Playground/OAPlayground.vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  spec: {
    type: Object,
    required: false,
  },
  openapi: {
    type: Object,
    required: true,
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
    default: (props: { hideBranding?: boolean, hideDefaultFooter?: boolean }) => {
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

const slots = defineSlots<Record<string, OperationSlot>>()

const operation = props.openapi.getOperation(props.operationId)

const operationPath = props.openapi.getOperationPath(props.operationId)

const operationMethod = props.openapi.getOperationMethod(props.operationId)

const operationServers = props.openapi.getOperationServers(props.operationId)

const headingPrefix = computed(() => {
  if (!props.prefixHeadings) {
    return null
  }

  return props.operationId
})

function hasSlot(name: OperationSlot): boolean {
  return slots[name] !== undefined
}
</script>

<template>
  <OAPath
    v-if="props.operationId"
    :id="props.operationId"
    :path="operationPath"
    :method="operationMethod"
    :servers="operationServers"
    :operation="operation"
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
      v-if="hasSlot('tags')"
      #tags="tags"
    >
      <slot
        name="tags"
        v-bind="tags"
      />
    </template>
    <template
      v-else
      #tags="tags"
    >
      <OAOperationTags
        :tags="tags.operation.tags"
      />
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
        v-if="Object.keys(security.securityUi).length"
        :security-ui="security.securityUi"
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
        :request-body="requestBody.requestBody"
        :content-type="requestBody.contentType"
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
        :servers="path.servers"
        @update:selected-server="path.updateSelectedServer"
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
        <OAPlayground
          :request="tryIt.request"
          :operation-id="tryIt.operationId"
          :path="tryIt.path"
          :method="tryIt.method"
          :base-url="tryIt.baseUrl"
          :parameters="tryIt.parameters"
          :request-body="tryIt.requestBody"
          :security-ui="tryIt.securityUi"
          :content-type="tryIt.contentType"
          :servers="tryIt.servers"
          :heading-prefix="headingPrefix"
          @update:selected-server="tryIt.updateSelectedServer"
          @update:request="tryIt.updateRequest"
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

      <ClientOnly>
        <OACodeSamples
          :operation-id="codeSamples.operationId"
          :request="codeSamples.request"
          :code-samples="codeSamples.codeSamples"
        />
      </ClientOnly>
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
