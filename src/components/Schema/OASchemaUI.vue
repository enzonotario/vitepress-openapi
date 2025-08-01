<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import { ChevronDown, ChevronRight, ChevronUp, Maximize2, Minimize2 } from 'lucide-vue-next'
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

const { t } = useI18n()

const isOpen = ref(props.open !== undefined ? props.open : props.deep > 0 && props.level <= props.deep)

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
const isCollapsible = computed(() => {
  if (!isObjectOrArray) {
    return false
  }
  if (Array.isArray(props.property.properties) && props.property.properties.length > 0) {
    return true
  }
  if (props.property.items) {
    return true
  }
  return false
})

const childProperties = computed(() => {
  if (props.property.properties) {
    return props.property.properties
  }
  if (props.property.items) {
    return [props.property.items]
  }
  return []
})
const isUnion = props.property.meta?.isOneOf === true || props.property.meta?.isAnyOf === true

const hasNestedObjectProperties = computed(() => {
  return props.property.properties
    && props.property.properties.length > 0
    && props.property.properties.some(p => (p.types?.includes('object') || p.types?.includes('array') || p.type === 'object' || p.type === 'array') && p.properties)
})

const hasNestedArrayItems = computed(() => {
  return props.property && props.property.properties
    && props.property.properties.length > 0
    && props.property.properties.some((p) => {
      return p.items
    })
})

const hasNestedExpandableContent = computed(() => {
  return isObjectOrArray
    && (hasNestedObjectProperties.value || hasNestedArrayItems.value)
})

const unionBadge = computed(() => {
  if (props.property.meta?.isOneOf === true) {
    return t('One of')
  } else if (props.property.meta?.isAnyOf === true) {
    return t('Any of')
  }
  return ''
})

const toggleLabel = computed(() => isOpen.value ? t('Collapse') : t('Expand'))

const toggleAllLabel = computed(() => isOpen.value ? t('Collapse all') : t('Expand all'))

const enumAttr = computed(() => ({ 'Valid values': props.property.enum }))
</script>

<template>
  <div>
    <Collapsible
      v-model:open="isOpen"
      :disabled="!isCollapsible"
    >
      <CollapsibleTrigger class="w-full">
        <div
          class="flex flex-col text-start space-y-1 group select-text"
          :class="{
            'cursor-pointer': isCollapsible,
          }"
        >
          <div class="flex flex-row flex-wrap items-center gap-2 text-sm">
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
                      v-if="isCollapsible"
                      size="icon"
                      variant="icon"
                      :aria-label="toggleLabel"
                      class="flex-shrink-0 w-4 h-4 cursor-pointer"
                    >
                      <ChevronDown v-if="isOpen" />
                      <ChevronRight v-else />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ toggleLabel }}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div class="flex flex-row items-center gap-1 text-muted-foreground">
              <Badge
                v-if="props.property.meta?.isCircularReference === true"
                variant="outline"
              >
                {{ t('Circular Reference') }}
              </Badge>
              <template v-else-if="props.property.types.length === 1 && ['array'].includes(props.property.types[0]) && props.property.subtype">
                <span>{{ props.property.subtype }}[]</span>
              </template>
              <template v-else-if="props.property.types.length === 1 && ['object'].includes(props.property.types[0]) && props.property.subtype">
                <span>{{ props.property.subtype }}</span>
              </template>
              <template v-else-if="props.property.meta?.isConstant === true">
                <span>{{ t('const:') }}</span>
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
              v-if="hasNestedExpandableContent"
              class="flex items-center"
            >
              <TooltipProvider>
                <Tooltip :delay-duration="200">
                  <TooltipTrigger as-child>
                    <Button
                      size="icon"
                      variant="icon"
                      :aria-label="toggleAllLabel"
                      @click.stop.prevent="toggleAllChildren(!isOpen)"
                    >
                      <Minimize2 v-if="isOpen" />
                      <Maximize2 v-else />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{{ toggleAllLabel }}</p>
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
              props.property.required === true ? t('Required') : ''
            }}</span>
          </div>
        </div>
      </CollapsibleTrigger>

      <OAMarkdown
        v-if="props.property?.description"
        :content="props.property.description"
        class="text-sm"
        :class="{
          'pl-2': isObjectOrArray,
        }"
      />

      <OASchemaPropertyAttributes v-if="props.property.enum" :property="enumAttr" />

      <OASchemaPropertyAttributes v-if="props.property.constraints" :property="props.property.constraints" />

      <template v-if="isCollapsible && props.property?.description">
        <CollapsibleTrigger>
          <Button
            as="div"
            variant="outline"
            size="xs"
            class="flex items-center font-normal rounded-md h-auto pr-1 text-sm gap-0.5"
          >
            {{ toggleLabel }}

            <div class="flex size-4 cursor-pointer items-center justify-center p-[2px]">
              <ChevronUp v-if="isOpen" />
              <ChevronRight v-else />
            </div>
          </Button>
        </CollapsibleTrigger>
      </template>

      <CollapsibleContent v-if="isObjectOrArray" class="ml-2 pl-2 border-l border-l-solid">
        <Badge
          v-if="isUnion"
          variant="outline"
        >
          {{ unionBadge }}
        </Badge>

        <div class="flex flex-col space-y-2">
          <OASchemaUI
            v-for="(subProperty, idx) in childProperties"
            :key="idx"
            :property="subProperty"
            :schema="props.schema"
            :deep="props.deep - 1"
            :level="props.level + 1"
            :open="childrenExpandState !== undefined ? childrenExpandState : (isUnion ? true : undefined)"
            :expand-all="childrenExpandState"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
