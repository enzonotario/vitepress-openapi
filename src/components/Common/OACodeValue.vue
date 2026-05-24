<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { computed } from 'vue'
import { formatValueForDisplay } from '@/lib/format/formatValueForDisplay'

const props = defineProps({
  value: {
    type: [String, Number, Boolean, Array, Object],
    required: true,
  },
  isEnum: {
    type: Boolean,
    default: false,
  },
  onSet: {
    type: Function,
    default: undefined,
  },
})

const { t } = useI18n()

function handleClick() {
  if (!props.onSet) {
    return
  }
  const valueToSet = props.isEnum ? String(props.value) : props.value
  props.onSet(valueToSet)
}

const isClickable = computed(() => !!props.onSet)
</script>

<template>
  <template v-if="Array.isArray(value)">
    <code
      v-for="(item, attributeIdx) in value"
      :key="attributeIdx"
      class="text-xs! text-wrap break-all"
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
    class="text-xs! break-all"
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
