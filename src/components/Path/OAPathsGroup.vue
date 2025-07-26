<script setup lang="ts">
import type { OperationSlot, PathsGroupView } from '../../types'
import { useI18n } from '@byjohann/vue-i18n'
import { computed, nextTick, ref } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { scrollToHash } from '../../lib/utils'
import OAHeading from '../Common/OAHeading.vue'
import OAMarkdown from '../Common/OAMarkdown.vue'
import { Button } from '../ui/button'
import { Collapsible, CollapsibleTrigger } from '../ui/collapsible'
import OAPaths from './OAPaths.vue'
import OAPathsSummary from './OAPathsSummary.vue'

interface Props {
  group: PathsGroupView
  hidePathsSummary?: boolean
  isLazy?: boolean
}

const props = defineProps<Props>()

const slots = defineSlots<Record<string, OperationSlot>>()

const themeConfig = useTheme()
const { t } = useI18n()

const lazyRendering = themeConfig.getSpecConfig()?.lazyRendering?.value

const showPathsSummary = computed(() =>
  props.hidePathsSummary === undefined
    ? themeConfig.getSpecConfig()?.showPathsSummary?.value
    : !props.hidePathsSummary,
)

const hasDescription = computed(() => props.group.description && props.group.description.trim() !== '')

const isOpen = ref(!themeConfig.getSpecConfig()?.collapsePaths?.value)

function onPathClick(hash: string) {
  isOpen.value = true
  nextTick(() => {
    scrollToHash({ hash })
  })
}
</script>

<template>
  <Collapsible v-model:open="isOpen">
    <div v-if="props.group.isGrouped">
      <OAHeading level="h1">
        {{ props.group.name }}
      </OAHeading>

      <div
        class="grid grid-cols-1 gap-10"
        :class="{ 'md:grid-cols-2': showPathsSummary && hasDescription }"
      >
        <OAMarkdown v-if="hasDescription" :content="group.description" class="my-[16px]" />
        <div v-if="showPathsSummary" class="flex-1 my-[16px]">
          <OAPathsSummary
            :paths="group.paths"
            @path-click="onPathClick($event)"
          />
        </div>
      </div>

      <div
        v-if="showPathsSummary || themeConfig.getSpecConfig()?.collapsePaths?.value === true"
        class="flex justify-center"
      >
        <CollapsibleTrigger>
          <Button>
            {{ isOpen ? t('Hide operations') : t('Show operations') }}
          </Button>
        </CollapsibleTrigger>
      </div>

      <hr>
    </div>

    <div
      v-if="!lazyRendering || isOpen"
      class="flex flex-col space-y-10"
      :class="{ hidden: !isOpen }"
    >
      <OAPaths :paths="group.paths">
        <!-- Expose all slots upwards -->
        <template v-for="(_, name) in slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}" />
        </template>
      </OAPaths>
    </div>
  </Collapsible>
</template>
