<script setup>
import { defineProps, ref } from 'vue'
import { Collapsible, CollapsibleTrigger } from 'vitepress-openapi/components/ui/collapsible'
import { Button } from 'vitepress-openapi/components/ui/button'
import { useI18n } from 'vue-i18n'
import { OpenApi, useOpenapi, useTheme } from 'vitepress-openapi'
import OAPathsSummary from 'vitepress-openapi/components/Path/OAPathsSummary.vue'

const props = defineProps({
  spec: {
    type: Object,
    required: true,
  },
  parsedSpec: {
    type: Object,
    required: false,
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
})

const { t } = useI18n()

const themeConfig = useTheme()

const spec = props.spec || useOpenapi().json

const openapi = OpenApi({ spec, parsedSpec: props.parsedSpec })

const tagsInfo = openapi.getTags()

const operationsTags = props.tags ?? openapi.getOperationsTags()

const pathsByTags = operationsTags.map((tag) => {
  return {
    tag,
    paths: openapi.getPathsByTags(tag),
  }
})

const internalTags = ref([
  {
    tag: t('Default'),
    paths: openapi.getPathsWithoutTags(),
    isOpen: !themeConfig.getSpecConfig().collapsePaths.value,
  },
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
    const element = document.querySelector(hash)

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

  setTimeout(() => {
    scrollIntoViewWithOffset(hash, 120)
  })
}
</script>

<template>
  <div
    v-for="tagPaths in internalTags"
    :key="tagPaths.tag"
    class="flex flex-col space-y-10"
  >
    <Collapsible
      v-if="Object.keys(tagPaths.paths).length"
      v-model:open="tagPaths.isOpen"
    >
      <OAHeading level="h1">
        {{ tagPaths.tag }}
      </OAHeading>

      <div
        :class="{ 'md:grid-cols-2': themeConfig.getSpecConfig().showPathsSummary.value }"
        class="grid grid-cols-1 gap-10"
      >
        <div>
          <p v-if="tagsInfo.find(tag => tag.name === tagPaths.tag)?.description">
            {{ tagsInfo.find(tag => tag.name === tagPaths.tag).description }}
          </p>
        </div>

        <div
          v-if="themeConfig.getSpecConfig().showPathsSummary.value"
          class="flex-1 my-[16px]"
        >
          <OAPathsSummary :spec="spec" :paths="tagPaths.paths" :is-dark="isDark" @path-click="onPathClick(tagPaths, $event)" />
        </div>
      </div>

      <div class="flex justify-center">
        <CollapsibleTrigger>
          <Button>
            {{ tagPaths.isOpen ? $t('Hide operations') : $t('Show operations') }}
          </Button>
        </CollapsibleTrigger>
      </div>

      <hr>

      <div class="flex flex-col space-y-10" :class="[{ hidden: !tagPaths.isOpen }]">
        <OAPaths
          :spec="spec"
          :parsed-spec="parsedSpec"
          :paths="tagPaths.paths"
        />
      </div>
    </Collapsible>
  </div>
</template>
