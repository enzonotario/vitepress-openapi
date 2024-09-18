<script setup>
import slugify from '@sindresorhus/slugify'
import { computed, useSlots } from 'vue'
import { useTheme } from 'vitepress-theme-openapi'

const props = defineProps({
  level: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: null,
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
  >
    <slot />

    <a
      class="header-anchor"
      :href="`#${id}`"
      :aria-label="`Permalink to ${slotText}`"
    >&#8203;</a>
  </component>
</template>
