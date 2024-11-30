<script setup>
import { Badge } from '../ui/badge'

const props = defineProps({
  method: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <Badge
    variant="plain"
    :class="[`OAMethodBadge--${props.method.toLowerCase()}`]"
    class="px-2 py-1 rounded"
  >
    {{ props.method.toUpperCase() }}
  </Badge>
</template>
