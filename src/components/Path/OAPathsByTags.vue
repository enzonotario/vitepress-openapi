<script setup lang="ts">
import { computed, defineProps, nextTick, ref } from 'vue'
import { Collapsible, CollapsibleTrigger } from 'vitepress-openapi/components/ui/collapsible'
import { Button } from 'vitepress-openapi/components/ui/button'
import { useI18n } from 'vue-i18n'
import { getOpenApiInstance, useTheme } from 'vitepress-openapi'
import OAPathsSummary from 'vitepress-openapi/components/Path/OAPathsSummary.vue'
import OALazy from 'vitepress-openapi/components/Common/Lazy/OALazy.vue'
import type { OperationSlot } from 'vitepress-openapi/types'

const props = defineProps({
  openapi: {
    type: Object,
    required: true,
  },
  tags: {
    type: Array,
    required: false,
  },
  paths: {
    type: Object,
    required: true,
  },
  isDark: {
    type: Boolean,
    default: false,
  },
  hidePathsSummary: {
    type: Boolean,
    default: undefined,
  },
})

const slots = defineSlots<OperationSlot>()

const { t } = useI18n()

const themeConfig = useTheme()

const openapi = props.openapi ?? getOpenApiInstance()

const tagsInfo = openapi.getTags()

const operationsTags = props.tags ?? openapi.getOperationsTags()

const pathsByTags = operationsTags.map((tag) => {
  return {
    tag,
    paths: openapi.getPathsByTags(tag),
  }
})

const pathsWithoutTags = openapi.getPathsWithoutTags()

const internalTags = ref([
  ...(pathsWithoutTags.length
    ? [
        {
          tag: t(useTheme().getSpecConfig.defaultTag),
          paths: pathsWithoutTags,
          isOpen: !themeConfig.getSpecConfig().collapsePaths.value,
        },
      ]
    : []),

  ...pathsByTags.map((tag) => {
    return {
      tag: tag.tag,
      paths: tag.paths,
      isOpen: !themeConfig.getSpecConfig().collapsePaths.value,
    }
  }),
])

function scrollIntoViewWithOffset(hash, offset) {
  if (!import.meta.env.SSR) {
    const element = document.querySelector(
      hash
        // . escape { and } characters
        .replace(/([{}])/g, '\\$1'),
    )

    if (!element) {
      return
    }

    window.scrollTo({
      behavior: 'smooth',
      top:
          element.getBoundingClientRect().top
          - document.body.getBoundingClientRect().top
          - offset,
    })

    window.location.hash = hash
  }
}

function onPathClick(tagPaths, hash) {
  tagPaths.isOpen = true

  nextTick(() => {
    scrollIntoViewWithOffset(hash, 120)
  })
}

const lazyRendering = themeConfig.getSpecConfig().lazyRendering.value

const showPathsSummary = computed(() => props.hidePathsSummary === undefined
  ? themeConfig.getSpecConfig().showPathsSummary.value
  : !props.hidePathsSummary,
)
</script>

<template>
  <OALazy
    v-for="(tagPaths, tagIdx) in internalTags"
    :key="tagPaths.tag"
    :is-lazy="lazyRendering && tagIdx > 0"
  >
    <Collapsible
      v-if="Object.keys(tagPaths.paths).length"
      v-model:open="tagPaths.isOpen"
    >
      <OAHeading level="h1">
        {{ tagPaths.tag }}
      </OAHeading>

      <div
        :class="{ 'md:grid-cols-2': showPathsSummary }"
        class="grid grid-cols-1 gap-10"
      >
        <div>
          <p v-if="tagsInfo.find(tag => tag.name === tagPaths.tag)?.description">
            {{ tagsInfo.find(tag => tag.name === tagPaths.tag).description }}
          </p>
        </div>

        <div
          v-if="showPathsSummary"
          class="flex-1 my-[16px]"
        >
          <OAPathsSummary
            :openapi="openapi"
            :paths="tagPaths.paths"
            :is-dark="isDark"
            @path-click="onPathClick(tagPaths, $event)"
          />
        </div>
      </div>

      <div
        v-if="showPathsSummary || themeConfig.getSpecConfig().collapsePaths.value === true"
        class="flex justify-center"
      >
        <CollapsibleTrigger>
          <Button>
            {{ tagPaths.isOpen ? $t('Hide operations') : $t('Show operations') }}
          </Button>
        </CollapsibleTrigger>
      </div>

      <hr>

      <div
        v-if="!lazyRendering || tagPaths.isOpen"
        class="flex flex-col space-y-10"
        :class="[{ hidden: !tagPaths.isOpen }]"
      >
        <OAPaths
          :openapi="openapi"
          :paths="tagPaths.paths"
        >
          <!-- Expose all slots upwards -->
          <template
            v-for="(_, name) in slots"
            #[name]="slotProps"
          >
            <slot
              :name="name"
              v-bind="slotProps || {}"
            />
          </template>
        </OAPaths>
      </div>
    </Collapsible>
  </OALazy>
</template>
