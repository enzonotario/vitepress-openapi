<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { getPropertyExamples } from '../../lib/examples/getPropertyExamples'
import { normalizeExamples } from '../../lib/examples/normalizeExamples'
import OAClickableCodeValue from '../Common/OAClickableCodeValue.vue'
import OAParameterAttribute from './OAParameterAttribute.vue'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
})

const examples = computed(() => {
  const values = getPropertyExamples(props.property)
  return normalizeExamples(values)
})

const wrapExamples = useTheme().getWrapExamples()
const { t } = useI18n()
</script>

<template>
  <div
    v-if="examples?.length === 1"
    class="flex flex-row items-center gap-2"
  >
    <span class="text-sm">{{ t('Example') }}</span>
    <OAClickableCodeValue
      :value="examples[0]?.value"
      :parameter-name="props.property.name"
    />
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
          <OAClickableCodeValue
            v-for="(example, idx) in examples"
            :key="idx"
            :value="example.value"
            :parameter-name="props.property.name"
          />
        </div>
      </template>
    </OAParameterAttribute>
  </div>
</template>
