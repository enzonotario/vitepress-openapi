<script setup lang="ts">
import OARemoteContext from './OARemoteContext.vue'

const props = defineProps({
  specUrl: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <Suspense>
    <OARemoteContext :spec-url="props.specUrl">
      <template #default="{ spec }">
        <slot :spec="spec" />
      </template>
    </OARemoteContext>
  </Suspense>
</template>
