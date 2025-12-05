<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { computed, ref, watch } from 'vue'
import { usePlayground } from '../../composables/usePlayground'
import { useTheme } from '../../composables/useTheme'
import { getPropertyExamples } from '../../lib/examples/getPropertyExamples'
import { hasNamedExamples } from '../../lib/examples/isNamedExample'
import { normalizeExamples } from '../../lib/examples/normalizeExamples'
import OACodeValue from '../Common/OACodeValue.vue'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
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

const isNamedExamples = computed(() => hasNamedExamples(examples.value))

const selectedExampleIndex = ref('0')

const selectedExample = computed(() => {
  if (!examples.value) {
    return null
  }
  const index = Number.parseInt(selectedExampleIndex.value, 10)
  return examples.value[index] ?? null
})

const { setParameterValue, hasOperationData } = usePlayground()

watch(selectedExampleIndex, () => {
  if (hasOperationData && props.property.name && selectedExample.value) {
    setParameterValue(props.property.name, selectedExample.value.value)
  }
})

watch(examples, () => {
  selectedExampleIndex.value = '0'
})

function getOptionLabel(example) {
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
      :parameter-name="props.property.name"
    />
  </div>

  <div
    v-if="examples?.length > 1 && isNamedExamples"
    class="flex flex-row items-center gap-2"
  >
    <OAParameterAttribute :name="t('Examples')">
      <template #value>
        <div class="flex justify-between items-start gap-2 flex-1">
          <OACodeValue
            v-if="selectedExample"
            :value="selectedExample.value"
            :parameter-name="props.property.name"
          />

          <Select v-model="selectedExampleIndex">
            <SelectTrigger
              :aria-label="t('Select an example')"
              class="h-6 max-w-28 bg-[var(--vp-code-bg)]"
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
        </div>
      </template>
    </OAParameterAttribute>
  </div>

  <div
    v-if="examples?.length > 1 && !isNamedExamples"
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
            :parameter-name="props.property.name"
          />
        </div>
      </template>
    </OAParameterAttribute>
  </div>
</template>
