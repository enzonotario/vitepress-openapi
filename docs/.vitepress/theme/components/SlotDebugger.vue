<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  slotProps: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  title: {
    type: String,
    default: 'Slot Props Debugger',
  },
})

const propsArray = computed(() => {
  return Object.entries(props.slotProps).map(([key, value]) => {
    return {
      key,
      value: typeof value === 'object' ? value : String(value),
      type: typeof value,
    }
  })
})
</script>

<template>
  <div class="p-2 rounded border border-dashed hover:border-primary">
    <h3 class="!mt-0">
      <code>{{ title }}</code> slot
    </h3>

    <details class="!mt-2">
      <summary class="!my-0 cursor-pointer">
        Slot Props
      </summary>
      <table class="!my-0 !mt-2">
        <thead>
          <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in propsArray" :key="prop.key">
            <td class="font-semibold">
              {{ prop.key }}
            </td>
            <td class="font-mono">
              {{ prop.type }}
            </td>
            <td>
              <OAVueJsonPretty v-if="typeof prop.value === 'object'" :code="prop.value" :deep="0" />
              <code v-else>{{ prop.value }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>
