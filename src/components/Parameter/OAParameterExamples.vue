<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { computed } from 'vue'
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

const examples = computed(() => {
  const values = getPropertyExamples(props.property)

  if (!values) {
    return null
  }

  if (Array.isArray(values)) {
    return values.map(value => ({
      name: typeof value === 'object' ? JSON.stringify(value) : String(value),
      value,
    }))
  }

  if (typeof values === 'object') {
    return Object.keys(values).map((key) => {
      const entry = values[key]
      const value = entry && typeof entry === 'object' && 'value' in entry ? entry.value : entry
      return {
        name: key,
        value,
      }
    })
  }

  return [
    {
      name: String(values),
      value: values,
    },
  ]
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
    <OACodeValue :value="examples[0]?.value" />
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
          >
            <OACodeValue :value="example.value" />
          </div>
        </div>
      </template>
    </OAParameterAttribute>
  </div>
</template>
