<script setup>
import { ChevronDown, ChevronRight, Maximize2, Minimize2 } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import OAMarkdown from '../Common/OAMarkdown.vue'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button/index'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip/index'
import OASchemaPropertyAttributes from './OASchemaPropertyAttributes.vue'

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
  schema: {
    type: Object,
    required: true,
  },
  deep: {
    type: Number,
    default: Infinity,
  },
  level: {
    type: Number,
    default: 0,
  },
  open: {
    type: Boolean,
    default: undefined,
  },
  expandAll: {
    type: Boolean,
    default: undefined,
  },
})

const isOpen = ref(props.open !== undefined ? props.open : props.deep > 0 && props.level <= 10)

const childrenExpandState = ref(undefined)

watch(() => props.expandAll, (newValue) => {
  if (newValue !== undefined) {
    isOpen.value = newValue
    childrenExpandState.value = newValue
  }
}, { immediate: true })

const toggleAllChildren = (expand) => {
  childrenExpandState.value = expand
  isOpen.value = expand
}

const isObject = props.property.types?.includes('object')
const isArray = props.property.types?.includes('array')
const isObjectOrArray = isObject || isArray || props.property.type === 'object' || props.property.type === 'array'

const hasExpandableProperties = computed(() => {
  return isObjectOrArray
    && props.property.properties
    && props.property.properties.length > 0
    && props.property.properties.some(p => (p.types?.includes('object') || p.types?.includes('array') || p.type === 'object' || p.type === 'array') && p.properties)
})
</script>

<template>
  <div>
    <Collapsible
      v-model:open="isOpen"
      :disabled="!isObjectOrArray"
    >
      <CollapsibleTrigger class="w-full">
        <div class="flex flex-col text-start space-y-1 group select-text cursor-auto">
          <div class="flex flex-row items-center gap-2 text-sm">
            <span
              v-if="props.property.name && props.property.name.trim() !== ''"
              class="font-bold"
            >
              {{ props.property.name }}
            </span>

            <div class="flex items-center">
              <TooltipProvider>
                <Tooltip :delay-duration="200">
                  <TooltipTrigger as-child>
                    <Button
                      v-if="isObjectOrArray && props.property.properties"
                      size="icon"
                      variant="icon"
                      :aria-label="isOpen ? $t('Collapse') : $t('Expand')"
                      class="flex-shrink-0 w-4 h-4 cursor-pointer"
                    >
                      <ChevronDown v-if="isOpen" />
                      <ChevronRight v-else />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ isOpen ? $t('Collapse') : $t('Expand') }}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div class="flex flex-row items-center gap-1 text-muted-foreground">
              <Badge
                v-if="props.property.meta?.isCircularReference === true"
                variant="outline"
              >
                {{ $t('Circular Reference') }}
              </Badge>
              <template v-else-if="props.property.types.length === 1 && ['array'].includes(props.property.types[0]) && props.property.subtype">
                <span>{{ props.property.subtype }}[]</span>
              </template>
              <template v-else-if="props.property.types.length === 1 && ['object'].includes(props.property.types[0]) && props.property.subtype">
                <span>{{ props.property.subtype }}</span>
              </template>
              <template v-else-if="props.property.meta?.isConstant === true">
                <span>{{ $t('const:') }}</span>
                <span v-if="props.property.examples?.length > 0" class="select-all">{{ props.property.examples[0] }}</span>
              </template>
              <template v-else>
                <span v-for="(type, index) in props.property.types" :key="type">
                  {{ type }}
                  <span v-if="index !== props.property.types.length - 1">|</span>
                </span>
              </template>
            </div>

            <div
              v-if="hasExpandableProperties"
              class="flex items-center"
            >
              <TooltipProvider>
                <Tooltip :delay-duration="200">
                  <TooltipTrigger as-child>
                    <Button
                      size="icon"
                      variant="icon"
                      :aria-label="isOpen ? $t('Collapse all') : $t('Expand all')"
                      @click.stop.prevent="toggleAllChildren(!isOpen)"
                    >
                      <Minimize2 v-if="isOpen" />
                      <Maximize2 v-else />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ isOpen ? $t('Collapse all') : $t('Expand all') }}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div class="flex-grow mx-2">
              <div
                v-if="props.property.required === true"
                class="h-px bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-gray-800"
              />
            </div>

            <span class="text-red-800 dark:text-red-200 text-xs">{{
              props.property.required === true ? $t('Required') : ''
            }}</span>
          </div>

          <OAMarkdown
            v-if="props.property?.description"
            :content="props.property.description"
            class="text-sm"
            :class="{
              'pl-2': isObjectOrArray,
            }"
          />

          <OASchemaPropertyAttributes v-if="props.property.enum" :property="{ [$t('valid values')]: props.property.enum }" />

          <OASchemaPropertyAttributes v-if="props.property.constraints" :property="props.property.constraints" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent v-if="isObjectOrArray" class="ml-2 pl-2 border-l border-l-solid">
        <Badge
          v-if="props.property.meta?.isOneOf === true || props.property.meta?.isAnyOf === true"
          variant="outline"
        >
          {{ props.property.meta?.isAnyOf === true ? $t('Any of') : $t('One of') }}
        </Badge>

        <div class="flex flex-col space-y-2">
          <OASchemaUI
            v-for="(subProperty, idx) in props.property.properties"
            :key="idx"
            :property="subProperty"
            :schema="props.schema"
            :deep="props.deep - 1"
            :level="props.level + 1"
            :open="childrenExpandState !== undefined ? childrenExpandState : (subProperty?.meta?.isOneOf === true || subProperty?.meta?.isAnyOf === true)"
            :expand-all="childrenExpandState"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
