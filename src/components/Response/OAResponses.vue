<script setup>
import { TabsIndicator } from 'radix-vue'
import { computed, defineProps, ref } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  responses: {
    type: Object,
    required: true,
  },
  headingPrefix: {
    type: String,
    default: null,
  },
})

const themeConfig = useTheme()

const responsesCodes = Object.keys(props.responses)

const vModel = ref(responsesCodes && responsesCodes.length > 0 ? responsesCodes[0] : null)

const tabsSelector = computed(() => {
  const selector = themeConfig.getResponseCodeSelector()

  if (selector === 'tabs') {
    const maxTabs = themeConfig.getResponseCodeMaxTabs()

    return maxTabs && responsesCodes.length > maxTabs ? 'select' : 'tabs'
  }

  return selector
})
</script>

<template>
  <div class="flex flex-col">
    <Tabs
      :default-value="vModel"
    >
      <div class="mt-[48px] mb-[16px] pt-[24px] border-t-[1px] border-[var(--vp-c-divider)]">
        <TabsList class="w-full bg-transparent text-muted-foreground p-0">
          <OAHeading
            level="h2"
            :prefix="headingPrefix"
            class="text-[var(--vp-c-text-1)] !my-0 !py-0 !border-t-0"
            header-anchor-class="!top-0"
          >
            {{ $t('Responses') }}
          </OAHeading>

          <span class="flex-grow min-w-2" />

          <div class="relative flex flex-row">
            <template v-if="tabsSelector === 'tabs'">
              <TabsIndicator class="absolute left-0 h-full bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded transition-[width,transform] duration-300 bg-muted" />

              <TabsTrigger
                v-for="responseCode in responsesCodes"
                :key="responseCode"
                :value="responseCode"
                class="h-full z-10"
              >
                {{ responseCode }}
              </TabsTrigger>
            </template>

            <Select
              v-if="tabsSelector === 'select'"
              v-model="vModel"
            >
              <SelectTrigger
                aria-label="Response Code"
                class="px-3 py-1.5 text-foreground"
              >
                <SelectValue>{{ vModel }}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <TabsTrigger
                    v-for="(code, idx) in responsesCodes"
                    :key="idx"
                    :value="code"
                    variant="select"
                  >
                    <SelectItem
                      :value="code"
                    >
                      {{ code }}
                    </SelectItem>
                  </TabsTrigger>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </TabsList>
      </div>

      <TabsContent
        v-for="responseCode in responsesCodes"
        :key="responseCode"
        :value="responseCode"
      >
        <OAResponse
          v-if="props.responses[responseCode]"
          :operation-id="props.operationId"
          :response="props.responses[responseCode]"
          :response-code="responseCode"
        />
      </TabsContent>
    </Tabs>
  </div>
</template>
