<script setup>
import OAContext from './OAContext.vue'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
    default: null,
  },
})
</script>

<template>
  <Suspense>
    <OAContext :spec="props.spec">
      <template #default="{ openapi }">
        <slot :openapi="openapi" />
      </template>
    </OAContext>
  </Suspense>
</template>
