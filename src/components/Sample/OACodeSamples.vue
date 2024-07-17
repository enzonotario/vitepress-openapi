<script setup>
import { useCodeSamples } from "../../composables/useCodeSamples";

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    default: 'GET',
  },
  isDark: {
    type: Boolean,
    default: false,
  },
})

const samples = useCodeSamples().getCodeSamples(props.operationId)
</script>

<template>
  <div>
    <div class="vp-code-group vp-adaptive-theme">
      <div class="tabs">
        <template v-for="(sample, key) in samples">
          <input type="radio" :name="`group-${props.operationId}`" :id="`tab-${props.operationId}-${key}`" :checked="key === 'curl'">
          <label :for="`tab-${props.operationId}-${key}`">{{ sample.label || sample.lang }}</label>
        </template>
      </div>

      <div class="blocks">
        <OACodeBlock v-for="(sample, key) in samples" :key="key" :code="sample.source"
                     :lang="sample.lang"
                     :label="sample.label"
                     :is-dark="props.isDark"
                     :class="{ 'active': key === 'curl' }" />
      </div>
    </div>
  </div>
</template>
