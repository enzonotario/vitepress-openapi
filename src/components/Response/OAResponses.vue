<script setup>
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

const responsesCodes = Object.keys(props.responses)
</script>

<template>
  <div class="flex flex-col">
    <Tabs
      :default-value="responsesCodes && responsesCodes[0]"
    >
      <TabsList class="w-full relative">
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
      >
        <OAResponse
          :responses="props.responses"
          :response-code="responseCode"
          :is-dark="props.isDark"
        />
      </TabsContent>
    </Tabs>
  </div>
</template>
