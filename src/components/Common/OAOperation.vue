<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    default: 'GET',
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
  <Path
    v-if="operationId"
    :id="operationId"
    :method="method"
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
      <div
        class="description"
        v-html="description.operation.description"
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

      <Parameters
        :operation-id="operationId"
        :parameters="parameters.parameters"
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
      >
        {{ $t('Responses') }}
      </OAHeading>

      <Responses
        :responses="responses.responses"
        :schema="responses.schema"
        :response-type="responses.responseType"
        :is-dark="isDark"
      >
        <template #body="body">
          <ResponseBody
            :schema="body.schema"
            :response-type="body.responseType"
          />
        </template>
      </Responses>
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
      <TryWithVariables
        :operation-id="tryIt.operationId"
        :method="tryIt.method"
        :path="tryIt.path"
        :base-url="tryIt.baseUrl"
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
  </Path>
</template>
