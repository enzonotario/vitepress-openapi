<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { computed } from 'vue'
import { usePlayground } from '../../composables/usePlayground'
import { formatValueForDisplay } from '../../lib/format/formatValueForDisplay'

const props = defineProps({
  value: {
    type: [String, Number, Boolean, Array, Object],
    required: true,
  },
  parameterName: {
    type: String,
    default: '',
  },
  isEnum: {
    type: Boolean,
    default: false,
  },
})

const { setParameterValue, hasOperationData } = usePlayground()
const { t } = useI18n()

function handleClick() {
  if (hasOperationData && props.parameterName) {
    const valueToSet = props.isEnum ? String(props.value) : props.value
    setParameterValue(props.parameterName, valueToSet)
  }
}

const isClickable = computed(() => hasOperationData && !!props.parameterName)
</script>

<template>
  <template v-if="Array.isArray(value)">
    <code
      v-for="(item, attributeIdx) in value"
      :key="attributeIdx"
      class="!text-xs text-wrap break-all"
      :class="{
        'cursor-pointer hover:opacity-80': isClickable,
      }"
      :role="isClickable ? 'button' : undefined"
      :title="isClickable ? t('Click to set in playground') : undefined"
      @click="isClickable ? handleClick() : undefined"
    >
      {{ formatValueForDisplay(item) }}
    </code>
  </template>

  <code
    v-else
    class="!text-xs break-all"
    :class="{
      'text-wrap': !value || typeof value !== 'object',
      'whitespace-pre-wrap': value && typeof value === 'object',
      'cursor-pointer hover:opacity-80': isClickable,
    }"
    :role="isClickable ? 'button' : undefined"
    :title="isClickable ? t('Click to set in playground') : undefined"
    @click="isClickable ? handleClick() : undefined"
  >
    {{ formatValueForDisplay(value) }}
  </code>
</template>
