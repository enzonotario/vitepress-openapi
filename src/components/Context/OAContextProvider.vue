<script setup>
import { useOpenapi } from '../../composables/useOpenapi'
import OASpecSkeleton from '../Feature/OASpecSkeleton.vue'
import OAContext from './OAContext.vue'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
    default: null,
  },
  specUrl: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:spec'])

const globalOpenApi = useOpenapi()
</script>

<template>
  <Suspense>
    <OAContext v-if="props.spec || props.specUrl" :spec="props.spec" :spec-url="props.specUrl" @update:spec="emit('update:spec', $event)">
      <template #default="{ openapi }">
        <slot :openapi="openapi" />
      </template>
    </OAContext>
    <OAContext v-else-if="globalOpenApi" :openapi="globalOpenApi">
      <template #default="{ openapi }">
        <slot :openapi="openapi" />
      </template>
    </OAContext>
    <div v-else>
      <p>OpenAPI instance not found</p>
    </div>

    <template #fallback>
      <OASpecSkeleton />
    </template>
  </Suspense>
</template>
