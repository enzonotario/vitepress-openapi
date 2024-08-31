<script setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'vitepress-theme-openapi/components/ui/tabs'
import { TabsIndicator } from 'radix-vue'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
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
  <div class="flex flex-col -mt-[52px]">
    <Tabs
      :default-value="responsesCodes && responsesCodes[0]"
    >
      <TabsList class="relative w-full bg-transparent">
        <TabsIndicator class="absolute left-0 h-full bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded transition-[width,transform] duration-300 bg-muted" />
        <span class="flex-1" />
        <TabsTrigger
          v-for="responseCode in responsesCodes"
          :key="responseCode"
          :value="responseCode"
          class="h-full z-10"
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
          :operation-id="props.operationId"
          :response="props.responses[responseCode]"
          :response-code="responseCode"
          :is-dark="props.isDark"
        />
      </TabsContent>
    </Tabs>
  </div>
</template>
