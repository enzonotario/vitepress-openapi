<script setup lang="ts">
import type { OperationData } from '../../lib/operationData'
import { defineProps, inject } from 'vue'
import OASecurityContent from '../Security/OASecurityContent.vue'

const { securityUi, headingPrefix } = defineProps({
  securityUi: {
    type: Object,
    required: true,
  },
  headingPrefix: {
    type: String,
    required: false,
    default: '',
  },
})

const operationData = inject('operationData') as OperationData
</script>

<template>
  <div class="flex flex-col">
    <div class="mt-[48px] mb-[16px] pt-[24px] border-t-[1px] border-[var(--vp-c-divider)]">
      <div class="flex flex-row items-center">
        <OAHeading
          level="h2"
          :prefix="headingPrefix"
          class="text-[var(--vp-c-text-1)] !my-0 !py-0 !border-t-0"
          header-anchor-class="!top-0"
        >
          {{ $t('Authorizations') }}
        </OAHeading>

        <span class="flex-grow min-w-2" />
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div v-for="(item, key) in securityUi" :key="key" class="flex flex-col gap-3">
        <div class="flex flex-col gap-1">
          <span
            v-if="Object.keys(securityUi).length > 1 && Object.keys(item.schemes).length > 1"
            :class="{
              'font-bold': operationData.security.selectedSchemeId.value === item.id,
            }"
          >
            {{ item.id }}
          </span>

          <div
            :class="{
              'pl-2 border-l': Object.keys(item.schemes).length > 1,
              'border-gray-600 dark:border-gray-400': Object.keys(securityUi).length > 1 && operationData.security.selectedSchemeId.value === item.id,
            }"
          >
            <div
              v-for="(scheme, schemeId, index) in item.schemes"
              :key="schemeId"
            >
              <OASecurityContent
                :name="String(schemeId)"
                :scheme="scheme"
              />

              <span v-if="index < Object.keys(item.schemes).length - 1" class="-ml-4 my-1 w-4 h-4 bg-muted rounded-full flex justify-center items-center">
                +
              </span>
            </div>
          </div>
        </div>

        <div v-if="Number(key) < Object.keys(securityUi).length - 1" class="flex flex-row items-center space-x-2">
          <span class="text-sm font-bold">{{ $t('or') }}</span>
          <span class="flex-grow border-t border-[var(--vp-c-divider)]" />
        </div>
      </div>
    </div>
  </div>
</template>
