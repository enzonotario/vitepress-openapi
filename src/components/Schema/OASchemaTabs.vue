<script setup>
import { computed, ref } from 'vue'
import { useTheme } from 'vitepress-openapi/composables/useTheme'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'vitepress-openapi/components/ui/tabs'
import { generateSchemaJson } from 'vitepress-openapi/lib/generateSchemaJson'
import { hasExample } from 'vitepress-openapi/lib/hasExample'
import { generateSchemaXml } from 'vitepress-openapi/lib/generateSchemaXml'
import { Checkbox } from 'vitepress-openapi/components/ui/checkbox'
import { Label } from 'vitepress-openapi/components/ui/label'

const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  contentType: {
    type: String,
    default: 'application/json',
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const themeConfig = useTheme()

const useExample = ref(true)

const schemaJson = computed(() => {
  return generateSchemaJson(props.schema, useExample.value) ?? props.schema
})

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

const schemaXml = computed(() => {
  return generateSchemaXml(props.schema, useExample.value)
})

const schemaContentType = computed(() => {
  if (props.contentType.includes('json')) {
    return schemaJson.value
  }
  if (props.contentType === 'application/xml') {
    return schemaXml.value
  }
  return null
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

const hasSchemaContentType = computed(() => schemaContentType.value !== null)
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
      <OASchemaBody
        :schema="props.schema"
        :deep="themeConfig.getSchemaViewerDeep()"
      />
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
          :code="schemaContentType"
          :lang="lang"
          :label="contentTypeLabel"
          :is-dark="props.isDark"
          class="!my-0"
        />
      </div>
    </TabsContent>
  </Tabs>
</template>
