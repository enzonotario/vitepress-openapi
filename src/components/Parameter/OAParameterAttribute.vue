<script setup lang="ts">
import type { Slots } from 'vue'
import { useSlots } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  boldName: {
    type: Boolean,
    default: false,
  },
  value: {
    type: [String, Number, Boolean, Object, Array],
    required: false,
  },
})

const slots: Slots = useSlots()

function hasSlot(name: string): boolean {
  return slots[name] !== undefined
}
</script>

<template>
  <div
    class="flex flex-row gap-2 text-sm"
  >
    <span
      :class="{
        'font-bold': props.boldName,
      }"
    >
      {{ props.name }}
    </span>

    <slot v-if="hasSlot('value')" name="value" />
    <span v-else class="text-muted-foreground">
      {{ props.value }}
    </span>
  </div>
</template>
