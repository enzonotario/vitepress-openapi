<script setup lang="ts">
import type { SandboxData } from '../../sandboxData'
import { Icon } from '@iconify/vue'
import { inject, nextTick, onMounted, ref } from 'vue'
import { Input } from '../../../../../src/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

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
  sandboxData.spec.value = undefined

  await nextTick(() => {
    sandboxData.specUrl.value = innerUrl.value
    sandboxData.loading.value = false
    sandboxData.specLoaded.value = true
  })
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
