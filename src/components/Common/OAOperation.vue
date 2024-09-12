<script setup>
import { computed, useSlots } from 'vue'

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
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()

const headingPrefix = computed(() => {
  if (!props.prefixHeadings) {
    return null
  }

  return props.operationId
})

function hasSlot(name) {
  return slots[name] !== undefined
}
</script>

<template>
  <OAPath
    v-if="props.operationId"
    :id="props.operationId"
    :spec="props.spec"
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
      <OAHeading
        level="h1"
        :prefix="headingPrefix"
      >
        {{ header.operation.summary }}
      </OAHeading>
    </template>

    <template
      v-if="hasSlot('path-mobile')"
      #path-mobile="pathMobile"
    >
      <slot
        name="path-mobile"
        v-bind="pathMobile"
      />
    </template>
    <template
      v-else
      #path-mobile="pathMobile"
    >
      <OAPathEndpoint
        :path="pathMobile.path"
        :method="pathMobile.method"
        :base-url="pathMobile.baseUrl"
        :hide-base-url="pathMobile.hideBaseUrl"
        class="sm:hidden"
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
      <OAHeading
        v-if="Object.keys(security.securitySchemes).length"
        level="h2"
        :prefix="headingPrefix"
      >
        {{ $t('Authorizations') }}
      </OAHeading>

      <OASecurity
        v-if="Object.keys(security.securitySchemes).length"
        :operation-id="security.operationId"
        :method="security.method"
        :path="security.path"
        :security-schemes="security.securitySchemes"
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
      <OAHeading
        level="h2"
        :prefix="headingPrefix"
        class="z-10"
      >
        {{ $t('Responses') }}
      </OAHeading>

      <OAResponses
        :operation-id="responses.operationId"
        :responses="responses.responses"
        :response-type="responses.responseType"
        :is-dark="isDark"
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
        class="hidden sm:flex"
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
      <OATryWithVariables
        :operation-id="tryIt.operationId"
        :path="tryIt.path"
        :method="tryIt.method"
        :base-url="tryIt.baseUrl"
        :parameters="tryIt.parameters"
        :schema="tryIt.schema"
        :security-schemes="tryIt.securitySchemes"
        :is-dark="isDark"
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
        {{ $t('Samples') }}
      </OAHeading>

      <OACodeSamples
        :operation-id="codeSamples.operationId"
        :path="codeSamples.path"
        :method="codeSamples.method"
        :base-url="codeSamples.baseUrl"
        :is-dark="isDark"
      />
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
    <template
      v-else-if="!hideDefaultFooter"
      #footer="footer"
    >
      <OAFooter />
    </template>
  </OAPath>
</template>
