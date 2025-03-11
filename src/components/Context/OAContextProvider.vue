<script setup>
import { inject, provide } from 'vue'
import { OPENAPI_GLOBAL_KEY, OPENAPI_LOCAL_KEY } from '../../composables/useOpenapi'
import OAContext from './OAContext.vue'

const props = defineProps({
  spec: {
    type: Object,
    required: false,
    default: null,
  },
})

const globalOpenApi = inject(OPENAPI_GLOBAL_KEY, undefined)

if (!props.spec && globalOpenApi) {
  provide(OPENAPI_LOCAL_KEY, globalOpenApi)
}
</script>

<template>
  <Suspense
    v-if="props.spec"
  >
    <OAContext :spec="props.spec">
      <template #default="{ openapi }">
        <slot :openapi="openapi" />
      </template>
    </OAContext>
  </Suspense>
  <template v-else-if="globalOpenApi">
    <slot :openapi="globalOpenApi" />
  </template>
  <div v-else>
    <p>OpenAPI instance not found</p>
  </div>
</template>
