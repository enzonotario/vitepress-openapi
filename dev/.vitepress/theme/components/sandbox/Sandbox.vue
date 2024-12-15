<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useData } from 'vitepress'
import SandboxPreview from './SandboxPreview.vue'
import SandboxNav from './SandboxNav.vue'

const loading = ref(false)

const initialSpecUrl = (window && new URLSearchParams(location.search).get('specUrl')) || 'https://vitepress-openapi.vercel.app/openapi.json'

const url = ref(initialSpecUrl)

const specUrl = ref(initialSpecUrl)

const { isDark } = useData()

function fetchSpec() {
  loading.value = true
  specUrl.value = null
  nextTick(() => {
    specUrl.value = url.value
  })
}

function specUpdated() {
  loading.value = false
}

function updateWindowLocation() {
  if (window && window.history) {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('specUrl', url.value)
    window.history.replaceState({}, '', `${location.pathname}?${searchParams}`)
  }
}

function share() {
  updateWindowLocation()

  navigator.clipboard.writeText(location.href)
}
</script>

<template>
  <div>
    <SandboxNav class="sticky top-0 z-50">
      <div class="flex flex-row items-center justify-center">
        <form @submit.prevent="fetchSpec">
          <input
            v-model="url"
            pattern="https?:\/\/.+"
            title="Please enter a valid HTTP/HTTPS URL"
            placeholder="Enter a spec URL"
            class="p-2 bg-muted rounded"
          >
          <button
            type="submit"
            :disabled="loading"
            class="p-2 bg-primary text-primary-foreground rounded disabled:cursor-not-allowed disabled:opacity-50"
          >
            Fetch
          </button>
        </form>
      </div>

      <template #end>
        <button
          class="p-2 bg-muted rounded"
          @click="share"
        >
          Share
        </button>
      </template>
    </SandboxNav>

    <SandboxPreview v-if="specUrl" :spec-url="specUrl" :is-dark="isDark" @update:spec="specUpdated" />
  </div>
</template>
