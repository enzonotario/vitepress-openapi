<script setup>
import { useOpenapi } from '../../composables/useOpenapi'
import OASpecSkeleton from '../Feature/OASpecSkeleton.vue'
import OAContext from './OAContext.vue'
import OAContextAsync from './OAContextAsync.vue'

const props = defineProps({
  spec: {
    type: [Object, String],
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
  <Suspense v-if="props.spec || props.specUrl">
    <OAContextAsync :spec="props.spec" :spec-url="props.specUrl" @update:spec="emit('update:spec', $event)">
      <template #default="{ openapi }">
        <slot :openapi="openapi" />
      </template>
    </OAContextAsync>
    <template #fallback>
      <OASpecSkeleton />
    </template>
  </Suspense>
  <template v-else-if="globalOpenApi">
    <OAContext :openapi="globalOpenApi">
      <template #default="{ openapi }">
        <slot :openapi="openapi" />
      </template>
    </OAContext>
  </template>
  <div v-else>
    <p>OpenAPI instance not found</p>
  </div>
</template>
