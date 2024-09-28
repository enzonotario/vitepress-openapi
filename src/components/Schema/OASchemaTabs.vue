<script setup>
import { computed, ref } from 'vue'
import { TabsIndicator } from 'radix-vue'
import { useTheme } from 'vitepress-theme-openapi/composables/useTheme'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'vitepress-theme-openapi/components/ui/tabs'
import { generateSchemaJson } from 'vitepress-theme-openapi/lib/generateSchemaJson'
import { hasExample } from 'vitepress-theme-openapi/lib/hasExample'
import { generateSchemaXml } from 'vitepress-theme-openapi/lib/generateSchemaXml'
import { Checkbox } from 'vitepress-theme-openapi/components/ui/checkbox'
import { Label } from 'vitepress-theme-openapi/components/ui/label'

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
  return generateSchemaJson(props.schema, useExample.value)
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
</script>

<template>
  <Tabs
    :default-value="schemaContentType !== null ? themeConfig.schemaConfig.defaultView : 'schema'"
    class="rounded border"
  >
    <TabsList class="relative flex flex-row justify-start rounded-t rounded-b-none p-0">
      <TabsIndicator class="absolute left-0 h-[2px] bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300 bg-black dark:bg-white" />
      <TabsTrigger
        value="schema"
        class="h-full"
      >
        {{ $t('Schema') }}
      </TabsTrigger>
      <TabsTrigger
        v-if="schemaContentType !== null"
        value="contentType"
        class="h-full"
      >
        {{ contentTypeLabel }}
      </TabsTrigger>
    </TabsList>
    <TabsContent
      value="schema"
      class="mt-0 p-2"
    >
      <OASchemaBody
        :schema="props.schema"
        :deep="themeConfig.getSchemaViewerDeep()"
      />
    </TabsContent>
    <TabsContent
      value="contentType"
      class="mt-0 p-2"
    >
      <div class="relative flex flex-col">
        <div
          v-if="schemaHasExample"
          class="absolute right-14 top-5 z-10 flex flex-row items-center gap-1"
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
          v-if="schemaContentType !== null"
          :code="schemaContentType"
          :lang="lang"
          :label="contentTypeLabel"
          :is-dark="props.isDark"
        />
      </div>
    </TabsContent>
  </Tabs>
</template>
