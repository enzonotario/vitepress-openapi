<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'
import { nextTick, onMounted, ref, useTemplateRef } from 'vue'

import { lazyBus } from './lazyBus'

/**
 * Component which loads lazily when the browser is "idle"
 * Disabled if being rendered from the server
 *
 * @link https://medium.com/js-dojo/lazy-rendering-in-vue-to-improve-performance-dcccd445d5f
 * @author [Scalar](https://github.com/scalar/scalar/tree/main/packages/api-reference)
 */
const props = withDefaults(
  defineProps<{
    // Identifier for loaded event, if no ID is passed then no event is dispatched
    id?: string
    // To lazyload or not to lazyload, that is the question
    isLazy?: boolean
    // Amount of time in ms to wait before triggering requestIdleCallback
    lazyTimeout?: number
  }>(),
  {
    isLazy: true,
    lazyTimeout: 0,
  },
)

const shouldRender = ref(!props.isLazy)
const sentinel = useTemplateRef('sentinel')

const emitLoaded = () => {
  const { id } = props
  if (id) {
    nextTick(() => {
      lazyBus.emit({ id })
    })
  }
}

// useIntersectionObserver is SSR-safe and self-cleans on unmount,
// so there's no need for manual onMounted/onUnmounted guards.
const { stop, isSupported } = useIntersectionObserver(
  sentinel,
  ([entry]) => {
    if (!entry.isIntersecting) {
      return
    }
    if (!entry.isIntersecting) {
      return
    }
    shouldRender.value = true
    emitLoaded()
    stop()
  },
  {
    rootMargin: '200px',
    threshold: 0,
  },
)

onMounted(() => {
  if (!props.isLazy) {
    emitLoaded()
    return
  }

  // If IntersectionObserver is unsupported, VueUse won't trigger the
  // callback, so fall back to rendering immediately.
  if (!isSupported.value) {
    shouldRender.value = true
    emitLoaded()
    stop()
  }
})
</script>

<template>
  <slot v-if="shouldRender" />
  <span v-else ref="sentinel" aria-hidden="true" style="display: block; height: 0; overflow: hidden" />
</template>
