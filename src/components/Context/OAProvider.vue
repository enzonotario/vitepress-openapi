<script setup lang="ts">
import type { OpenApiSpecInstance } from '../../lib/spec/createOpenApiSpec'
import { provide } from 'vue'
import {
  getGlobalOpenapi,
  injectOpenapi,
  OPENAPI_LOCAL_KEY,
} from '../../composables/useOpenapi'
import OASpecSkeleton from '../Feature/OASpecSkeleton.vue'
import OAProviderAsync from './OAProviderAsync.vue'

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
  openapi: {
    type: Object as () => OpenApiSpecInstance | null,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:spec'])

const needsAsync = props.spec || props.specUrl
const existingOpenapi = props.openapi ?? injectOpenapi() ?? getGlobalOpenapi()

if (existingOpenapi && !needsAsync) {
  provide(OPENAPI_LOCAL_KEY, existingOpenapi)
}
</script>

<template>
  <Suspense v-if="needsAsync">
    <OAProviderAsync
      :spec="props.spec"
      :spec-url="props.specUrl"
      @update:spec="emit('update:spec', $event)"
    >
      <template #default="{ openapi: asyncOpenapi }">
        <slot :openapi="asyncOpenapi" />
      </template>
    </OAProviderAsync>
    <template #fallback>
      <OASpecSkeleton />
    </template>
  </Suspense>
  <template v-else-if="existingOpenapi">
    <slot :openapi="existingOpenapi" />
  </template>
  <div v-else>
    <p>OpenAPI instance not found</p>
  </div>
</template>
