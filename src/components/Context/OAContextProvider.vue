<script setup>
import { inject } from 'vue'
import { OPENAPI_GLOBAL_KEY } from '../../composables/useOpenapi'
import OAContext from './OAContext.vue'
import OAContextAsync from './OAContextAsync.vue'

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

const globalOpenApi = inject(OPENAPI_GLOBAL_KEY, undefined)
</script>

<template>
  <Suspense v-if="props.spec || props.specUrl">
    <OAContextAsync :spec="props.spec" :spec-url="props.specUrl" @update:spec="emit('update:spec', $event)">
      <template #default="{ openapi }">
        <slot :openapi="openapi" />
      </template>
    </OAContextAsync>
    <template #fallback>
      <p>Loading OpenAPI specification...</p>
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
