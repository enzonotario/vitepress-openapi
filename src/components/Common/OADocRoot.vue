<script setup lang="ts">
import { inject } from 'vue'
import { DOC_ROOT_KEY } from '../../lib/docRoot'

// The entry components already forward their attrs to the content; keep this wrapper attr-free.
defineOptions({ inheritAttrs: false })

// Outside VitePress, the content needs a `.vp-doc` ancestor for standalone.css.
// Inside VitePress, pages already have one, so render the content as is.
const vpDoc = inject(DOC_ROOT_KEY, false)
</script>

<template>
  <div v-if="vpDoc" class="vp-doc">
    <slot />
  </div>
  <slot v-else />
</template>
