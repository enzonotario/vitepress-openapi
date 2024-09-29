<script setup>
import slugify from '@sindresorhus/slugify'
import { computed, useSlots } from 'vue'
import { useTheme } from 'vitepress-theme-openapi'
import { cn } from '../../lib/utils'

const props = defineProps({
  level: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    required: false,
  },
  headerAnchorClass: {
    type: String,
    default: 'header-anchor',
  },
})

function getSlotChildrenText(children) {
  return children.map((node) => {
    if (!node.children || typeof node.children === 'string') {
      return node.children || ''
    } else if (Array.isArray(node.children)) {
      return getSlotChildrenText(node.children)
    } else if (node.children.default) {
      return getSlotChildrenText(node.children.default())
    }

    return ''
  }).join('')
}

const slots = useSlots()

const defaultSlot = slots.default

const slotText = computed(() => {
  return getSlotChildrenText(defaultSlot())
})

const id = computed(() => {
  const value = props.prefix ? `${props.prefix}-${slotText.value}` : slotText.value

  return slugify(value, { decamelize: false })
})

const themeConfig = useTheme()

const hLevel = computed(() => {
  return themeConfig.getHeadingLevel(props.level) ?? props.level
})
</script>

<template>
  <component
    :is="hLevel"
    :id="id"
    tabindex="-1"
    :class="cn(props.class)"
  >
    <slot />

    <a
      :class="cn('header-anchor', props.headerAnchorClass)"
      :href="`#${id}`"
      :aria-label="`Permalink to ${slotText}`"
    >&#8203;</a>
  </component>
</template>
