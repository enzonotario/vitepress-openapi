<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import { usePlaygroundSpecSelection } from '../../composables/usePlaygroundSpecSelection'

const props = withDefaults(defineProps<{
  mobile?: boolean
}>(), {
  mobile: false,
})

const route = useRoute()
const { specs, selectedSpecUrl } = usePlaygroundSpecSelection()

const isPlaygroundPage = computed(() => route.path.includes('/example/playground'))
const selectId = computed(() => props.mobile ? 'playground-spec-select-mobile' : 'playground-spec-select-desktop')
</script>

<template>
  <div
    v-if="isPlaygroundPage && specs.length > 0"
    class="PlaygroundSpecSelect"
    :class="{
      'is-desktop': !props.mobile,
      'is-mobile': props.mobile,
    }"
  >
    <label :for="selectId" class="label" :class="{ 'sr-only': !props.mobile }">
      {{ props.mobile ? 'Select OpenAPI Specification' : 'Spec' }}
    </label>

    <select
      :id="selectId"
      v-model="selectedSpecUrl"
      class="select"
      aria-label="Select OpenAPI Specification"
    >
      <option v-for="spec in specs" :key="spec.url" :value="spec.url">
        {{ spec.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.PlaygroundSpecSelect {
  gap: 8px;
}

.PlaygroundSpecSelect.is-desktop {
  display: none;
  align-items: center;
  margin-left: 12px;
}

.PlaygroundSpecSelect.is-mobile {
  display: flex;
  flex-direction: column;
  padding: 12px 24px;
}

.label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.select {
  width: min(100%, 240px);
  height: 32px;
  padding: 0 32px 0 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 1px var(--vp-c-brand-1);
}

@media (min-width: 960px) {
  .PlaygroundSpecSelect.is-desktop {
    display: flex;
  }

  .PlaygroundSpecSelect.is-mobile {
    display: none;
  }
}
</style>
