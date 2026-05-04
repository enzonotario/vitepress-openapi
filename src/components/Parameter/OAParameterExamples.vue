<script setup lang="ts">
import type { NormalizedExample } from '@/lib/examples/normalizeExamples'
import { useI18n } from '@byjohann/vue-i18n'
import { computed, ref, watch } from 'vue'
import { getPropertyExamples } from '@/lib/examples/getPropertyExamples'
import { hasNamedExamples } from '@/lib/examples/isNamedExample'
import { normalizeExamples } from '@/lib/examples/normalizeExamples'
import { usePlayground } from '../../composables/usePlayground'
import { useTheme } from '../../composables/useTheme'
import OACodeValue from '../Common/OACodeValue.vue'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import OAParameterAttribute from './OAParameterAttribute.vue'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
  securitySchemeName: {
    type: String,
    default: undefined,
  },
})

const examples = computed(() => {
  const values = getPropertyExamples(props.property)
  return normalizeExamples(values)
})

const isNamedExamples = computed(() => hasNamedExamples(examples.value))

const selectedExampleIndex = ref('0')

const selectedExample = computed(() => {
  if (!examples.value) {
    return null
  }
  const index = Number.parseInt(selectedExampleIndex.value, 10)
  return examples.value[index] ?? null
})

const { setParameterValue, setSecurityValue, hasOperationData } = usePlayground()

const setValueFn = computed(() => {
  if (!hasOperationData) {
    return undefined
  }
  if (props.securitySchemeName) {
    const schemeName = props.securitySchemeName
    return (v: any) => setSecurityValue(schemeName, v)
  }
  if (props.property.name) {
    return (v: any) => setParameterValue(props.property.name, v)
  }
  return undefined
})

watch(selectedExampleIndex, () => {
  if (!hasOperationData || !selectedExample.value) {
    return
  }
  setValueFn.value?.(selectedExample.value.value)
})

watch(examples, () => {
  selectedExampleIndex.value = '0'
})

function getOptionLabel(example: NormalizedExample) {
  if (example.summary) {
    return `${example.name} - ${example.summary}`
  }
  return example.name
}

const wrapExamples = useTheme().getWrapExamples()
const { t } = useI18n()
</script>

<template>
  <div
    v-if="examples?.length === 1"
    class="flex flex-row items-center gap-2"
  >
    <span class="text-sm">{{ t('Example') }}</span>
    <OACodeValue
      :value="examples[0]?.value"
      :on-set="setValueFn"
    />
  </div>

  <div
    v-if="(examples?.length ?? 0) > 1 && isNamedExamples"
    class="flex flex-row items-center gap-2"
  >
    <OAParameterAttribute :name="t('Examples')" class="flex-1">
      <template #value>
        <OACodeValue
          v-if="selectedExample"
          :value="selectedExample.value"
          :on-set="setValueFn"
        />
      </template>

      <template #end>
        <Select v-model="selectedExampleIndex">
          <SelectTrigger
            :aria-label="t('Select an example')"
            class="h-6 max-w-28 bg-(--vp-code-bg)"
          >
            <SelectValue :placeholder="t('Select an example')" class="truncate">
              {{ selectedExample?.name }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="(example, idx) in examples"
                :key="example.name ?? idx"
                :value="String(idx)"
              >
                {{ getOptionLabel(example) }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </template>
    </OAParameterAttribute>
  </div>

  <div
    v-if="(examples?.length ?? 0) > 1 && !isNamedExamples"
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
            :value="example.value"
            :on-set="setValueFn"
          />
        </div>
      </template>
    </OAParameterAttribute>
  </div>
</template>
