<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { computed } from 'vue'
import { usePlayground } from '../../composables/usePlayground'
import OACodeValue from './OACodeValue.vue'

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
  <div
    v-if="isClickable"
    class="cursor-pointer hover:opacity-80"
    role="button"
    :title="t('Click to set in playground')"
    @click="handleClick"
  >
    <OACodeValue :value="value" />
  </div>
  <OACodeValue
    v-else
    :value="value"
  />
</template>
