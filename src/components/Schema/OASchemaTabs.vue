<script setup>
import { computed, ref } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { hasExample } from '../../lib/hasExample'
import { getSchemaUiContentType } from '../../lib/getSchemaUiContentType'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import OASchemaUI from '../Schema/OASchemaUI.vue'

const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  schemaUiContentType: {
    type: [Object, String, Number, Boolean, Array],
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const themeConfig = useTheme()

const useExample = ref(true)

const schemaHasExample = hasExample(props.schema)

const checkboxId = `useExample-${Math.random().toString(36).substring(7)}`

const contentTypeLabel = computed(() => {
  if (props.contentType.includes('json')) {
    return 'JSON'
  }
  if (props.contentType === 'application/xml') {
    return 'XML'
  }
  return 'Schema'
})

const lang = computed(() => {
  if (props.contentType.includes('json')) {
    return 'json'
  }
  if (props.contentType === 'application/xml') {
    return 'xml'
  }
  return props.contentType
})

const hasSchemaContentType = computed(() => props.schemaUiContentType !== null)

const schemaUiContentType = computed(() => {
  if (useExample.value) {
    return props.schemaUiContentType
  }

  return getSchemaUiContentType(props.contentType, props.schema, useExample.value)
})
</script>

<template>
  <Tabs
    :default-value="hasSchemaContentType ? themeConfig.schemaConfig.defaultView : 'schema'"
  >
    <TabsList class="relative flex flex-row justify-start">
      <TabsTrigger
        value="schema"
        variant="schemaTabs"
        class="h-full"
      >
        {{ $t('Schema') }}
      </TabsTrigger>
      <TabsTrigger
        v-if="hasSchemaContentType"
        value="contentType"
        variant="schemaTabs"
        class="h-full"
      >
        {{ contentTypeLabel }}
      </TabsTrigger>
    </TabsList>
    <TabsContent value="schema">
      <div class="flex flex-col gap-2">
        <OASchemaUI
          :property="props.schema"
          :schema="props.schema"
          :deep="themeConfig.getSchemaViewerDeep()"
        />
      </div>
    </TabsContent>
    <TabsContent value="contentType">
      <div class="relative flex flex-col">
        <div
          v-if="schemaHasExample"
          class="absolute right-14 top-1 z-10 flex flex-row items-center gap-1"
        >
          <Checkbox
            :id="checkboxId"
            :checked="useExample"
            name="useExample"
            aria-label="Use example"
            @update:checked="useExample = $event"
          />
          <Label
            :for="checkboxId"
            class="text-gray-800 dark:text-gray-200 text-sm"
          >
            {{ $t('Use example') }}
          </Label>
        </div>

        <OACodeBlock
          v-if="hasSchemaContentType"
          :code="schemaUiContentType"
          :lang="lang"
          :label="contentTypeLabel"
          :is-dark="props.isDark"
          class="!my-0"
        />
      </div>
    </TabsContent>
  </Tabs>
</template>
