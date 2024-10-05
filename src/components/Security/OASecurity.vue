<script setup lang="ts">
import { computed, defineProps, onMounted } from 'vue'
import OASecurityContent from 'vitepress-theme-openapi/components/Security/OASecurityContent.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'vitepress-theme-openapi/components/ui/select'
import { useTheme } from 'vitepress-theme-openapi'

const { securitySchemes, headingPrefix } = defineProps({
  securitySchemes: {
    type: Object,
    required: true,
  },
  headingPrefix: {
    type: String,
    required: false,
    default: '',
  },
})

const themeConfig = useTheme()

const firstSecurityScheme = Object.keys(securitySchemes).find(Boolean)

const selectedSchemeName = computed(() => {
  return themeConfig.securityConfig.selectedScheme.value
})

const selectedScheme = computed(() => {
  return securitySchemes[selectedSchemeName.value]
})

onMounted(() => {
  if (!themeConfig.securityConfig.selectedScheme.value) {
    themeConfig.securityConfig.selectedScheme.value = firstSecurityScheme
  }
})
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

        <div v-if="Object.keys(securitySchemes).length > 1" class="relative flex flex-row">
          <Select
            :model-value="themeConfig.securityConfig.selectedScheme.value"
            @update:model-value="themeConfig.securityConfig.selectedScheme.value = $event"
          >
            <SelectTrigger
              aria-label="Security Scheme"
              class="px-3 py-1.5 text-foreground"
            >
              <SelectValue :placeholder="selectedScheme?.name ?? $t('Select...')" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="(scheme, name) in securitySchemes"
                  :key="name"
                  :value="name"
                >
                  {{ name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <OASecurityContent
      v-if="selectedSchemeName && selectedScheme"
      :name="selectedSchemeName"
      :scheme="selectedScheme"
    />
  </div>
</template>
