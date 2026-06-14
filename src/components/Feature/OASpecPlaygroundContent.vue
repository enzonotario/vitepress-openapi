<script setup lang="ts">
import type { SpecPlaygroundSlot } from '../../types'
import { useScrollLock } from '@vueuse/core'
import { useData } from 'vitepress'
import VPBackdrop from 'vitepress/dist/client/theme-default/components/VPBackdrop.vue'
import { ref, watch } from 'vue'
import { usePlaygroundData } from '../../lib/playgroundData'
import OAFooter from '../Common/OAFooter.vue'
import OAOperationPlayground from './OAOperationPlayground.vue'
import OAPlaygroundLocalNav from './OAPlaygroundLocalNav.vue'
import OAPlaygroundSidebar from './OAPlaygroundSidebar.vue'

const props = defineProps({
  hideBranding: {
    type: Boolean,
    default: false,
  },
  openapi: {
    type: Object,
    required: true,
  },
})

const slots = defineSlots<{ [K in SpecPlaygroundSlot]?: (props: any) => any }>()

function hasSlot(name: SpecPlaygroundSlot): boolean {
  return slots[name] !== undefined
}

const { hash } = useData()
const { selectedOperation } = usePlaygroundData()

const sidebarNavEl = ref<HTMLElement | null>(null)
const isSidebarOpen = ref(false)
const isScrollLocked = useScrollLock(typeof document === 'undefined' ? null : document.body)

function openSidebar() {
  isSidebarOpen.value = true
}

function closeSidebar() {
  isSidebarOpen.value = false
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

watch(hash, closeSidebar)

watch(
  [isSidebarOpen, sidebarNavEl],
  () => {
    if (isSidebarOpen.value) {
      isScrollLocked.value = true
      sidebarNavEl.value?.focus()
    }
    else {
      isScrollLocked.value = false
    }
  },
  {
    flush: 'post',
    immediate: true,
  },
)
</script>

<template>
  <div class="OASpecPlayground">
    <VPBackdrop :show="isSidebarOpen" @click="closeSidebar" />

    <OAPlaygroundLocalNav :open="isSidebarOpen" @open-menu="openSidebar" />

    <aside class="OASidebar" :class="{ open: isSidebarOpen }" @click.stop>
      <div class="curtain" />

      <nav
        id="OASidebarNav"
        ref="sidebarNavEl"
        class="nav"
        aria-labelledby="sidebar-aria-label"
        tabindex="-1"
      >
        <span id="sidebar-aria-label" class="visually-hidden">
          Sidebar Navigation
        </span>

        <slot
          v-if="hasSlot('sidebar')"
          name="sidebar"
          :openapi="props.openapi"
          :sidebar-open="isSidebarOpen"
          :open-sidebar="openSidebar"
          :close-sidebar="closeSidebar"
          :toggle-sidebar="toggleSidebar"
        />
        <OAPlaygroundSidebar
          v-else
          :openapi="props.openapi"
        />
      </nav>
    </aside>

    <template v-if="hasSlot('playground')">
      <slot
        :key="selectedOperation?.operationId"
        name="playground"
        :openapi="props.openapi"
        :operation-id="selectedOperation?.operationId"
      />
    </template>
    <template v-else>
      <div class="OAContent has-sidebar vp-doc">
        <div class="OADoc w-full max-w-3xl mx-auto flex flex-col space-y-4">
          <OAOperationPlayground
            v-if="selectedOperation"
            :key="selectedOperation.operationId"
            :openapi="props.openapi"
            :operation-id="selectedOperation.operationId"
          />
          <div v-else class="flex items-center justify-center h-64 text-gray-500">
            {{ $t('Select an operation to try it out') }}
          </div>

          <OAFooter v-if="!props.hideBranding" />
        </div>
      </div>
    </template>
  </div>
</template>
