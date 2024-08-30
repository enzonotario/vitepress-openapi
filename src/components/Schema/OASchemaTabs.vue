<script setup>
import { useTheme } from 'vitepress-theme-openapi/composables/useTheme'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'vitepress-theme-openapi/components/ui/tabs'
import { TabsIndicator } from 'radix-vue'
import { generateSchemaJson } from 'vitepress-theme-openapi/utils/generateSchemaJson';
import { computed, ref } from 'vue';

const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const theme = useTheme()

const useExample = ref(true)

const schemaJson = computed(() => {
  return generateSchemaJson(props.schema, useExample.value)
})

const checkboxId = `useExample-${Math.random().toString(36).substring(7)}`
</script>

<template>
  <Tabs
    :default-value="theme.schemaDefaultView"
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
      class="mt-0 p-2"
    >
      <OASchemaBody :schema="props.schema" />
    </TabsContent>
    <TabsContent
      value="json"
      class="mt-0 p-2"
    >
      <div class="relative flex flex-col">
        <!--      useExample checkbox-->
        <div class="absolute right-14 top-4 z-10">
          <input
            :id="checkboxId"
            v-model="useExample"
            type="checkbox"
            name="useExample"
          >
          <label
            :for="checkboxId"
            class="ml-1 text-gray-800 dark:text-gray-200 text-sm"
          >
            {{ $t('Use example') }}
          </label>
        </div>

        <OACodeBlock
          :code="schemaJson"
          lang="json"
          label="JSON"
          :is-dark="props.isDark"
        />
      </div>
    </TabsContent>
  </Tabs>
</template>
