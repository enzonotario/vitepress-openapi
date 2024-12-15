<script setup lang="ts">
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
      <div class="animate-pulse flex flex-col gap-6 p-4">
        <div class="flex flex-col gap-4">
          <div class="w-1/3 h-10 bg-muted rounded" />
          <div class="w-1/4 h-4 bg-muted rounded" />
          <div class="w-1/2 h-4 bg-muted rounded" />
        </div>

        <hr>

        <div class="flex flex-col gap-4">
          <div class="w-1/3 h-10 bg-muted rounded" />
          <div class="w-full h-20 bg-muted rounded" />
        </div>

        <hr>

        <div class="flex flex-col gap-4">
          <div class="w-1/3 h-10 bg-muted rounded" />
          <div class="w-1/2 h-4 bg-muted rounded" />
        </div>
      </div>
    </template>
  </Suspense>
</template>
