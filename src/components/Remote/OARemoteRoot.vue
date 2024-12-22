<script setup lang="ts">
import OASpecSkeleton from '../Spec/OASpecSkeleton.vue'
import OARemoteContext from './OARemoteContext.vue'

const props = defineProps({
  specUrl: {
    type: String,
    required: true,
  },
})

const emits = defineEmits([
  'update:spec',
])
</script>

<template>
  <Suspense>
    <OARemoteContext :spec-url="props.specUrl" @update:spec="emits('update:spec', $event)">
      <template #default="{ spec }">
        <slot :spec="spec" />
      </template>
    </OARemoteContext>

    <template #fallback>
      <OASpecSkeleton />
    </template>
  </Suspense>
</template>
