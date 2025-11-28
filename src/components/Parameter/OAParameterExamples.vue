<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { computed, inject } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { getPropertyExamples } from '../../lib/examples/getPropertyExamples'
import { normalizeExamples } from '../../lib/examples/normalizeExamples'
import { OPERATION_DATA_KEY } from '../../lib/operationData'
import OACodeValue from '../Common/OACodeValue.vue'
import OAParameterAttribute from './OAParameterAttribute.vue'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
})

const operationData = inject(OPERATION_DATA_KEY)

const examples = computed(() => {
  const values = getPropertyExamples(props.property)
  return normalizeExamples(values)
})

const wrapExamples = useTheme().getWrapExamples()
const { t } = useI18n()

function setExample(value) {
  if (operationData && props.property.name) {
    operationData.playground.parameterValues.value[props.property.name] = typeof value === 'object' && value !== null
      ? JSON.stringify(value)
      : String(value)
  }
}
</script>

<template>
  <div
    v-if="examples?.length === 1"
    class="flex flex-row items-center gap-2"
  >
    <span class="text-sm">{{ t('Example') }}</span>
    <div
      class="cursor-pointer hover:opacity-80"
      role="button"
      :title="t('Click to set in playground')"
      @click="setExample(examples[0]?.value)"
    >
      <OACodeValue :value="examples[0]?.value" />
    </div>
  </div>
  <div
    v-if="examples?.length > 1"
    class="flex flex-row flex-wrap gap-2"
    :class="{
      'items-center': wrapExamples,
    }"
  >
    <OAParameterAttribute :name="t('Examples')">
      <template #value>
        <div
          class="flex gap-2"
          :class="{
            'flex-col': !wrapExamples,
            'flex-row flex-wrap': wrapExamples,
          }"
        >
          <div
            v-for="(example, idx) in examples"
            :key="idx"
            class="cursor-pointer hover:opacity-80"
            role="button"
            :title="t('Click to set in playground')"
            @click="setExample(example.value)"
          >
            <OACodeValue :value="example.value" />
          </div>
        </div>
      </template>
    </OAParameterAttribute>
  </div>
</template>
