<script setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'vitepress-theme-openapi/components/ui/tabs'
import { TabsIndicator } from 'radix-vue'

const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  schemaJson: {
    type: String,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <Tabs
    default-value="schema"
    class="rounded border dark:border-gray-700"
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
        value="json"
        class="h-full"
      >
        {{ $t('JSON') }}
      </TabsTrigger>
    </TabsList>
    <TabsContent
      value="schema"
      class="p-2"
    >
      <OASchemaBody :schema="props.schema" />
    </TabsContent>
    <TabsContent
      value="json"
      class="p-2"
    >
      <OACodeBlock
        :code="props.schemaJson"
        lang="json"
        label="JSON"
        :is-dark="props.isDark"
      />
    </TabsContent>
  </Tabs>
</template>
