<script setup lang="ts">
import OAContextProvider from '../Context/OAContextProvider.vue'
import OASpecContent from '../Feature/OASpecContent.vue'

const props = defineProps({
  specUrl: {
    type: String,
    required: true,
  },
})

const emits = defineEmits([
  'update:spec',
])
</script>

<template>
  <OAContextProvider :spec-url="props.specUrl" @update:spec="emits('update:spec', $event)">
    <template #default="{ openapi }">
      <OASpecContent
        v-bind="{
          ...$attrs,
          openapi,
        }"
      >
        <!-- Expose all slots upwards -->
        <template v-for="(_, name) in slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps || {}" />
        </template>
      </OASpecContent>
    </template>
  </OAContextProvider>
</template>
