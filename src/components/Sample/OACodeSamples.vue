<script setup>
import { useCodeSamples } from "../../composables/useCodeSamples";
import { ref, watch } from "vue";

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

const samples = ref(null)

watch(() => props.isDark, async () => {
  samples.value = await useCodeSamples().getCodeSamples(props.operationId, {
    theme: props.isDark ? 'vitesse-dark' : 'vitesse-light',
  })
}, {
  immediate: true,
})
</script>

<template>
  <div>
    <div v-if="samples"
         class="vp-code-group vp-adaptive-theme">
      <div class="tabs">
        <template v-for="(sample, key) in samples">
          <input type="radio" :name="`group-${props.operationId}`" :id="`tab-${props.operationId}-${key}`" :checked="key === 'curl'">
          <label :for="`tab-${props.operationId}-${key}`">{{ sample.label || sample.lang }}</label>
        </template>
      </div>

      <div class="blocks">
        <div v-for="(sample, key) in samples" :key="key"
             class="vp-adaptive-theme"
             :class="[
                 `language-${sample.lang}`,
                 { 'active': key === 'curl' }
             ]"
        >
          <button title="Copy Code" class="copy"></button>
          <span class="lang">{{ sample.lang }}</span>
          <div v-if="sample.html" v-html="sample.html" class="code"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
.shiki.vitesse-light {
  @apply bg-transparent !important;
}
</style>
