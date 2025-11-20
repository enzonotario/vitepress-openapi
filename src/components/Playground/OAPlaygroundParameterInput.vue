<script setup lang="ts">
import { useI18n } from '@byjohann/vue-i18n'
import { Plus, Trash } from 'lucide-vue-next'
import { defineEmits, defineProps, onMounted, ref, watch } from 'vue'
import { getPropertyExample } from '../../lib/examples/getPropertyExample'
import { Button } from '../ui/button'
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

onMounted(() => {
  if (props.parameter.schema?.enum) {
    emits('update:modelValue', getPropertyExample(props.parameter) ?? props.parameter.schema.enum[0])
  }
})

const parameterExample = getPropertyExample(props.parameter)
const { t } = useI18n()

const objectEntries = ref<{ id: string, key: string, value: string }[]>([])

function syncObjectEntries() {
  if (props.parameter.schema?.type === 'object' && props.modelValue && typeof props.modelValue === 'object') {
    const currentObj = objectEntries.value.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
    if (JSON.stringify(currentObj) !== JSON.stringify(props.modelValue)) {
      objectEntries.value = Object.entries(props.modelValue).map(([key, value]) => ({
        id: Math.random().toString(36).substring(7),
        key,
        value: String(value),
      }))
    }
  }
}

watch(() => props.modelValue, () => {
  syncObjectEntries()
}, { deep: true })

onMounted(() => {
  syncObjectEntries()
})

function updateObject() {
  const obj = objectEntries.value.reduce((acc, { key, value }) => {
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  if (!props.enabled) {
    emits('update:enabled', true)
  }

  emits('update:modelValue', obj)
}

function addObjectField() {
  objectEntries.value.push({ id: Math.random().toString(36).substring(7), key: '', value: '' })

  if (!props.enabled) {
    emits('update:enabled', true)
  }
}

function removeObjectField(index: number) {
  objectEntries.value.splice(index, 1)
  updateObject()
}
</script>

<template>
  <div class="grid gap-2 items-center" :class="{ 'grid-cols-2': !hideLabel, 'grid-cols-1': hideLabel }">
    <div v-if="!hideLabel" class="flex items-center gap-2">
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
        @update:model-value="handleInputChange($event)"
      >
        <SelectTrigger :aria-label="String(parameterExample ?? t('Select'))">
          <SelectValue :placeholder="String(parameterExample ?? t('Select'))" />
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

      <div v-else-if="parameter.schema?.type === 'object'" class="flex flex-col gap-2 w-full">
        <div v-for="(entry, index) in objectEntries" :key="entry.id" class="flex gap-2">
          <Input
            v-model="entry.key"
            placeholder="Key"
            class="flex-1 bg-muted"
            @input="updateObject"
          />
          <Input
            v-model="entry.value"
            placeholder="Value"
            class="flex-1 bg-muted"
            @input="updateObject"
          />
          <Button variant="ghost" size="icon" @click="removeObjectField(index)">
            <Trash class="w-4 h-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" class="w-full" @click="addObjectField">
          <Plus class="w-4 h-4 mr-2" />
          {{ t('Add Field') }}
        </Button>
      </div>

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
            :value="modelValue as any"
            :type="inputType(parameter)"
            :placeholder="String(parameterExample ?? '')"
            class="bg-muted"
            @update:model-value="handleInputChange($event)"
            @keydown.enter="emits('submit')"
          />
        </template>
      </div>
    </div>
  </div>
</template>
