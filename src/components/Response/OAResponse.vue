<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { computed, defineProps, ref } from 'vue'
import { useTheme } from '../../composables/useTheme'
import OAContentTypeSelect from '../Common/OAContentTypeSelect.vue'
import OASchemaTabs from '../Schema/OASchemaTabs.vue'
import { Label } from '../ui/label'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  response: {
    type: Object,
    required: true,
  },
  responseCode: {
    type: String,
    required: true,
  },
})

const contentTypes = Object.keys(props.response.content ?? {})

const contentType = ref(contentTypes[0] ?? undefined)

const schema = computed(() => props.response.content?.[contentType.value]?.ui)

const examples = computed(() => props.response.content?.[contentType.value]?.examples)

const contentTypeId = `content-type-${Math.random().toString(36).substring(7)}`

const defaultView = useTheme().getResponseBodyDefaultView()
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col space-y-4">
    <span class="text-lg">{{ props.response.description }}</span>

    <div
      v-if="props.response?.content && contentTypes.length"
      class="flex flex-row items-center gap-2 text-xs"
    >
      <Label
        :for="contentTypeId"
        class="flex-shrink-0 text-muted-foreground"
      >
        {{ t('Content-Type') }}
      </Label>
      <div class="flex-shrink-0">
        <OAContentTypeSelect
          :id="contentTypeId"
          v-model="contentType"
          :content-type="contentType"
          :content-types="contentTypes"
        />
      </div>
    </div>

    <OASchemaTabs
      v-if="schema"
      :schema="schema"
      :examples="examples"
      :content-type="contentType"
      :default-view="defaultView"
    />
  </div>
</template>
