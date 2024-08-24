<script setup>
import { useOpenapi } from 'vitepress-theme-openapi/composables/useOpenapi'
import { ref, useSlots } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'vitepress-theme-openapi/components/ui/tabs'
import { TabsIndicator } from 'radix-vue'

const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  responses: {
    type: Object,
    required: true,
  },
  responseType: {
    type: String,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()

const responsesCodes = Object.keys(props.responses)

const schemaJson = ref(useOpenapi().propertiesTypesJson(props.schema, props.responseType))

function hasSlot(name) {
  return slots[name] !== undefined
}
</script>

<template>
  <div class="flex flex-col">
    <Tabs
      :default-value="responsesCodes[0]"
      class="rounded border dark:border-gray-700"
    >
      <TabsList class="relative flex flex-row justify-start rounded-t rounded-b-none p-0">
        <TabsIndicator class="absolute left-0 h-[2px] bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300 bg-black dark:bg-white" />
        <TabsTrigger
          v-for="responseCode in responsesCodes"
          :key="responseCode"
          :value="responseCode"
          class="h-full"
        >
          {{ responseCode }}
        </TabsTrigger>
      </TabsList>
      <TabsContent
        v-for="responseCode in responsesCodes"
        :key="responseCode"
        :value="responseCode"
        class="p-2"
      >
        <div class="flex flex-col space-y-4">
          <span class="text-gray-800 dark:text-gray-200 text-lg">{{ responses[responseCode].description }}</span>

          <div
            v-if="responses[responseCode]?.content"
            class="flex flex-row items-center text-xs space-x-2"
          >
            <span class="text-gray-600 dark:text-gray-400">Content-Type:</span>
            <span class="text-gray-800 dark:text-gray-200">{{ Object.keys(responses[responseCode].content)[0] }}</span>
          </div>

          <slot
            name="body"
            :response-type="responseType"
            :schema="props.schema"
          />

          <slot
            name="example"
            :json="schemaJson"
          />

          <OACodeBlock
            v-if="!hasSlot('example')"
            :code="schemaJson"
            lang="json"
            label="JSON"
            :is-dark="isDark"
            class="max-h-96"
          />
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
