<script setup>
import { useTheme } from '../../composables/useTheme'
import OAHeading from '../Common/OAHeading.vue'
import OASchemaTabs from '../Schema/OASchemaTabs.vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  requestBody: {
    type: Object,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  headingPrefix: {
    type: String,
    default: null,
  },
})

const defaultView = useTheme().getRequestBodyDefaultView()
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
        {{ $t('Request Body') }}
      </OAHeading>
    </div>

    <OASchemaTabs
      :schema="props.requestBody?.content?.[props.contentType]?.ui"
      :examples="props.requestBody?.content?.[props.contentType]?.examples"
      :content-type="props.contentType"
      :default-view="defaultView"
    />
  </div>
</template>
