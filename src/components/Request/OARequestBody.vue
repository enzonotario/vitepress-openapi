<script setup lang="ts">
import type { OperationData } from '../../lib/operationData'
import type { OARequestBody } from '../../types'
import { useI18n } from '@byjohann/vue-i18n'
import { computed, inject } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { OPERATION_DATA_KEY } from '../../lib/operationData'
import OAContentTypeSelect from '../Common/OAContentTypeSelect.vue'
import OAHeading from '../Common/OAHeading.vue'
import OASchemaTabs from '../Schema/OASchemaTabs.vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  requestBody: {
    type: Object as () => OARequestBody,
    required: true,
  },
  headingPrefix: {
    type: String,
    default: null,
  },
})

const defaultView = useTheme().getRequestBodyDefaultView()

const contentTypeId = `request-body-content-type-${props.operationId}`

const operationData = inject(OPERATION_DATA_KEY) as OperationData
const { t } = useI18n()

const contentType = computed({
  get: () => operationData.requestBody.selectedContentType.value,
  set: (value) => {
    operationData.requestBody.selectedContentType.value = value
  },
})

const schema = computed(() => {
  if (!contentType.value || !props.requestBody?.content?.[contentType.value]) {
    return {}
  }

  return props.requestBody?.content?.[contentType.value]?.ui ?? {}
})

const examples = computed(() => {
  if (!contentType.value || !props.requestBody?.content?.[contentType.value]) {
    return {}
  }

  return Object.entries(props.requestBody?.content?.[contentType.value]?.examples ?? {})
    .reduce((acc, [key, example]) => {
      if (example?.hideOnSchemaTabs) {
        return acc
      }
      acc[key] = example
      return acc
    }, {} as Record<string, any>)
})
</script>

<template>
  <div>
    <div class="mt-[48px] mb-[16px] pt-[24px] border-t-[1px] border-[var(--vp-c-divider)] flex flex-row items-center">
      <OAHeading
        level="h2"
        :prefix="headingPrefix"
        class="text-[var(--vp-c-text-1)] !my-0 !py-0 !border-t-0 inline-block"
        header-anchor-class="!top-0"
      >
        {{ t('Request Body') }}
      </OAHeading>
      <div class="relative flex-1">
        <div class="absolute inset-x-0 top-[-14px] w-full flex justify-end">
          <OAContentTypeSelect
            :id="contentTypeId"
            v-model="contentType"
            :content-type="contentType"
            :content-types="Object.keys(props.requestBody?.content ?? {})"
          />
        </div>
      </div>
    </div>

    <OASchemaTabs
      :schema="schema"
      :examples="examples"
      :content-type="contentType"
      :default-view="defaultView"
    />
  </div>
</template>
