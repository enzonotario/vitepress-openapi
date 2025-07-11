<script setup lang="ts">
import type { OperationSlot } from '../../types'
import { useI18n } from '@byjohann/vue-i18n'
import { computed } from 'vue'
import OAFooter from '../Common/OAFooter.vue'
import OAHeaderBadges from '../Common/OAHeaderBadges.vue'
import OAHeading from '../Common/OAHeading.vue'
import OAMarkdown from '../Common/OAMarkdown.vue'
import OAOperationTags from '../Operation/OAOperationTags.vue'
import OAParameters from '../Parameter/OAParameters.vue'
import OAPath from '../Path/OAPath.vue'
import OAPathEndpoint from '../Path/OAPathEndpoint.vue'
import OAPlayground from '../Playground/OAPlayground.vue'
import OARequestBody from '../Request/OARequestBody.vue'
import OAResponses from '../Response/OAResponses.vue'
import OACodeSamples from '../Sample/OACodeSamples.vue'
import OASecurity from '../Security/OASecurity.vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
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

const { t } = useI18n()

const operation = props.openapi.getOperation(props.operationId)

const headingPrefix = computed(() => {
  if (!props.prefixHeadings) {
    return undefined
  }

  return props.operationId
})

function hasSlot(name: OperationSlot): boolean {
  if (name === 'try-it' && slots[name] !== undefined) {
    console.warn(
      '`try-it` slot is deprecated. Use `playground` slot instead.',
    )
  }

  return slots[name] !== undefined
}
</script>

<template>
  <OAPath
    v-if="props.operationId && operation"
    :id="props.operationId"
    :operation="operation"
    :openapi="props.openapi"
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
          class="scroll-m-[var(--vp-nav-height)]"
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
        :selected-scheme-id="security.selectedSchemeId"
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
        {{ t('Parameters') }}
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
      <OARequestBody
        :operation-id="requestBody.operationId"
        :request-body="requestBody.requestBody"
        :heading-prefix="headingPrefix"
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
      />
    </template>

    <template
      v-if="hasSlot('try-it')"
      #playground="playground"
    >
      <slot
        name="try-it"
        v-bind="playground"
      />
    </template>
    <template
      v-else-if="hasSlot('playground')"
      #playground="playground"
    >
      <slot
        name="playground"
        v-bind="playground"
      />
    </template>
    <template
      v-else
      #playground="playground"
    >
      <OAPlayground
        :operation-id="playground.operationId"
        :path="playground.path"
        :method="playground.method"
        :parameters="playground.parameters"
        :request-body="playground.requestBody"
        :security-ui="playground.securityUi"
        :servers="playground.servers"
        :heading-prefix="headingPrefix"
      />
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
        {{ t('Samples') }}
      </OAHeading>

      <OACodeSamples
        :operation-id="codeSamples.operationId"
        :code-samples="codeSamples.codeSamples"
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
