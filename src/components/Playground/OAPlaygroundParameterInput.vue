<script setup lang="ts">
import type { PlaygroundExampleBehavior } from '../../composables/useTheme'
import { getPropertyExample } from '@/lib/examples/getPropertyExample'
import { formatValueForPlaceholder } from '@/lib/format/formatValueForDisplay'
import { useExampleForPlaceholder, useExampleForValue } from '@/lib/playground/playgroundExampleBehavior'
import { useI18n } from '@byjohann/vue-i18n'
import { computed, defineEmits, defineProps, onMounted } from 'vue'
import OAJSONEditor from '../Common/OAJSONEditor.vue'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const props = defineProps({
  parameter: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean, null, Array, Object, File],
    required: true,
  },
  compositeKey: {
    type: String,
    required: true,
  },
  exampleBehavior: {
    type: String as () => PlaygroundExampleBehavior,
    default: 'value',
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  hideLabel: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits([
  'update:modelValue',
  'update:enabled',
  'submit',
])

const { t } = useI18n()

const parameterExample = computed(() => getPropertyExample(props.parameter))

const exampleForPlaceholder = computed(() =>
  useExampleForPlaceholder(props.exampleBehavior) ? parameterExample.value : null,
)

const exampleForValue = computed(() =>
  useExampleForValue(props.exampleBehavior) ? parameterExample.value : null,
)

const selectPlaceholder = computed(() =>
  formatValueForPlaceholder(exampleForPlaceholder.value ?? t('Select')),
)

const inputPlaceholder = computed(() =>
  formatValueForPlaceholder(exampleForPlaceholder.value ?? ''),
)

const displayValue = computed(() => {
  if (typeof props.modelValue === 'object' && props.modelValue !== null) {
    return JSON.stringify(props.modelValue)
  }
  return props.modelValue
})

onMounted(() => {
  if (props.parameter.schema?.enum) {
    emits('update:modelValue', exampleForValue.value ?? props.parameter.schema.enum[0])
  }
})

function handleInputChange(value: any) {
  if (!props.enabled) {
    emits('update:enabled', true)
  }

  emits('update:modelValue', value)
}

function isBinary(parameter: any) {
  return parameter.schema?.format === 'binary'
}

function inputType(parameter: any) {
  if (parameter.schema?.type === 'integer') {
    return 'number'
  }
  if (parameter.schema?.type === 'number') {
    return 'number'
  }
  if (isBinary(parameter)) {
    return 'file'
  }
  return 'text'
}

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target?.files?.[0]
  handleInputChange(file ?? null)
}
</script>

<template>
  <div
    class="grid gap-2"
    :class="{
      'grid-cols-2': !hideLabel,
      'grid-cols-1': hideLabel,
      'items-center': parameter.schema?.type !== 'object',
      'items-start': parameter.schema?.type === 'object',
    }"
  >
    <div
      v-if="!hideLabel"
      class="flex items-center gap-2"
      :class="{
        'pt-2': parameter.schema?.type === 'object',
      }"
    >
      <Checkbox
        :id="`enable-${compositeKey}`"
        :name="`enable-${compositeKey}`"
        :model-value="enabled"
        variant="toggle"
        @update:model-value="emits('update:enabled', $event)"
      />

      <Label v-if="parameter.name" :for="compositeKey" class="text-sm font-bold space-x-2">
        <span>{{ parameter.name }}</span>
        <span
          v-if="parameter.required"
          class="text-sm text-destructive"
        >*</span>
      </Label>
    </div>

    <div
      class="flex items-center flex-grow gap-2"
      :class="{ 'opacity-50': !enabled }"
    >
      <Checkbox
        v-if="['boolean'].includes(parameter.schema?.type)"
        :id="compositeKey"
        :name="compositeKey"
        :model-value="String(modelValue) === '' ? 'indeterminate' : (modelValue as boolean)"
        @update:model-value="handleInputChange($event)"
        @keydown.enter="emits('submit')"
      />

      <Select
        v-else-if="parameter.schema?.enum"
        :id="compositeKey"
        :name="compositeKey"
        :model-value="String(modelValue ?? '')"
        @update:model-value="handleInputChange($event)"
      >
        <SelectTrigger :aria-label="selectPlaceholder">
          <SelectValue :placeholder="selectPlaceholder" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="enumValue in parameter.schema.enum"
              :key="enumValue"
              :value="String(enumValue)"
            >
              {{ enumValue }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <OAJSONEditor
        v-else-if="parameter.schema?.type === 'object'"
        :model-value="modelValue"
        class="w-full h-32"
        @update:model-value="handleInputChange($event)"
      />

      <div v-else class="flex-grow flex items-center gap-1">
        <template v-if="isBinary(parameter)">
          <Input
            :id="compositeKey"
            :name="compositeKey"
            type="file"
            class="bg-muted"
            @change="onFileChange"
          />
        </template>
        <template v-else>
          <Input
            :id="compositeKey"
            :name="compositeKey"
            :model-value="displayValue as any"
            :type="inputType(parameter)"
            :placeholder="inputPlaceholder"
            class="bg-muted"
            @update:model-value="handleInputChange($event)"
            @keydown.enter="emits('submit')"
          />
        </template>
      </div>
    </div>
  </div>
</template>
