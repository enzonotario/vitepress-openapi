<script setup lang="ts">
import { inject, nextTick, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Input } from '../../../../../src/components/ui/input'
import type { SandboxData } from '../types'

const sandboxData = inject('sandboxData') as SandboxData

const innerUrl = ref(sandboxData?.specUrl?.value)

onMounted(() => {
  if (innerUrl.value && (!sandboxData.spec.value || !Object.keys(sandboxData.spec.value).length)) {
    fetchSpec()
  }
})

async function fetchSpec() {
  sandboxData.loading.value = true
  sandboxData.specLoaded.value = false
  sandboxData.specUrl.value = null

  try {
    const response = await fetch(innerUrl.value)
    const data = await response.json()

    sandboxData.spec.value = data
  } catch (error) {
    sandboxData.spec.value = {}
  } finally {
    await nextTick(() => {
      sandboxData.specUrl.value = innerUrl.value
      sandboxData.loading.value = false
      sandboxData.specLoaded.value = true
    })
  }
}
</script>

<template>
  <Popover>
    <PopoverTrigger class="p-2 hover:bg-muted rounded-full">
      <Icon icon="mdi:internet" />
    </PopoverTrigger>
    <PopoverContent>
      <div class="flex flex-row items-center justify-center">
        <form class="flex flex-row items-center gap-2" @submit.prevent="fetchSpec">
          <Input
            v-model="innerUrl"
            type="text"
            placeholder="Enter a spec URL"
          />
          <button
            type="submit"
            :disabled="sandboxData.loading.value"
            class="px-2 py-1 bg-primary text-primary-foreground rounded"
          >
            Fetch
          </button>
        </form>
      </div>
    </PopoverContent>
  </Popover>
</template>
