<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { getConstraints } from '../../lib/parser/constraintsParser'
import OACodeValue from '../Common/OACodeValue.vue'
import OAMarkdown from '../Common/OAMarkdown.vue'
import OAParameterAttribute from './OAParameterAttribute.vue'
import OAParameterExamples from './OAParameterExamples.vue'

const props = defineProps({
  parameter: {
    type: Object,
    required: true,
  },
})

const constraints = getConstraints(props.parameter.schema)
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col p-3 gap-2 rounded bg-muted">
    <div class="flex flex-col gap-2">
      <div class="flex flex-row items-center gap-2">
        <span class="text-sm font-bold">{{ props.parameter.name }}</span>
        <span
          v-if="props.parameter.required"
          class="text-sm text-destructive"
        >*</span>
      </div>

      <OAMarkdown
        v-if="props.parameter.description"
        :content="props.parameter.description"
        class="text-sm"
      />
    </div>

    <div
      v-if="props.parameter.schema"
      class="flex flex-col gap-2"
    >
      <div class="flex flex-row gap-2">
        <OAParameterAttribute
          v-if="props.parameter.schema.type"
          :name="t('Type')"
          :value="props.parameter.schema.type"
          bold-name
        />

        <span
          v-if="props.parameter.required"
          class="text-sm text-destructive"
        >{{ t('Required') }}</span>
      </div>

      <OAParameterAttribute v-if="props.parameter.schema.enum" :name="t('Enum')" :value="props.parameter.schema.enum.join(', ')">
        <template #value>
          <div class="flex flex-wrap gap-2">
            <OACodeValue
              v-for="(value, idx) in props.parameter.schema.enum"
              :key="idx"
              :value="value"
            />
          </div>
        </template>
      </OAParameterAttribute>

      <OAParameterExamples :property="props.parameter" />

      <template v-if="Object.keys(constraints).length > 0">
        <OAParameterAttribute
          v-for="(value, name) in constraints"
          :key="name"
          :name="name"
        >
          <template #value>
            <OACodeValue :value="value" />
          </template>
        </OAParameterAttribute>
      </template>
    </div>
  </div>
</template>
