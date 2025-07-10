<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { useTheme } from '../../composables/useTheme'
import { getPropertyExamples } from '../../lib/examples/getPropertyExamples'
import OACodeValue from '../Common/OACodeValue.vue'
import OAParameterAttribute from './OAParameterAttribute.vue'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
})

const examples = getPropertyExamples(props.property)

const wrapExamples = useTheme().getWrapExamples()
const { t } = useI18n()
</script>

<template>
  <div
    v-if="examples?.length === 1"
    class="flex flex-row space-x-2"
  >
    <span class="text-sm">{{ t('Example') }}</span>
    <OACodeValue :value="examples[0]" />
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
          <OACodeValue
            v-for="(example, idx) in examples"
            :key="idx"
            :value="example"
          />
        </div>
      </template>
    </OAParameterAttribute>
  </div>
</template>
