<script setup>
import { useI18n } from '@byjohann/vue-i18n'
import OAMethodBadge from '../Common/OAMethodBadge.vue'

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
  hideBaseUrl: {
    type: Boolean,
    default: false,
  },
  deprecated: {
    type: Boolean,
    default: false,
  },
  servers: {
    type: Array,
    required: false,
  },
})

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-2 text-sm bg-muted rounded p-1.5">
    <div class="language-bash !overflow-hidden !m-0 h-8 flex flex-row items-center gap-1.5">
      <button
        :title="t('Copy endpoint')"
        class="copy absolute !top-1 z-50 OAPathEndpoint__copy"
      />

      <OAMethodBadge :method="props.method" />

      <div class="overflow-x-auto whitespace-nowrap">
        <span class="flex flex-row flex-shrink-0">
          <span
            v-if="!props.hideBaseUrl"
            class="text-muted-foreground hidden md:inline-block"
          >
            {{ props.baseUrl }}
          </span>
          <span
            :class="{
              'line-through': props.deprecated,
            }"
            class="font-bold select-all"
          >{{ props.path }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.OAPathEndpoint__copy {
  width: 1.5rem !important;
  height: 1.5rem !important;
}

.OAPathEndpoint__copy.copied::before {
  height: 1.5rem !important;
}
</style>
