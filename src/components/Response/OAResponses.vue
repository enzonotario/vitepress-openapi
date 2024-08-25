<script setup>
import { useSlots } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'vitepress-theme-openapi/components/ui/tabs'
import { TabsIndicator } from 'radix-vue'

const props = defineProps({
  responses: {
    type: Object,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()

const responsesCodes = Object.keys(props.responses)

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
        <OAResponse
          :responses="props.responses"
          :response-code="responseCode"
          :is-dark="props.isDark"
        >
          <template v-if="hasSlot('body')" #body="body">
            <slot
              name="body"
              v-bind="body"
            />
          </template>

          <template v-if="hasSlot('example')" #example="example">
            <slot
              name="example"
              v-bind="example"
            />
          </template>
        </OAResponse>
      </TabsContent>
    </Tabs>
  </div>
</template>
