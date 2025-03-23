<script setup>
import { computed } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '../ui/select'

const themeConfig = useTheme()

const i18nConfig = themeConfig.getI18nConfig()

const defaultLocale = computed(() => i18nConfig.locale?.value ?? 'en')

function onLocaleChange(locale) {
  themeConfig.setI18nConfig({
    locale,
  })
}
</script>

<template>
  <div class="self-center">
    <Select
      :default-value="defaultLocale"
      :value="i18nConfig.locale.value"
      @update:model-value="onLocaleChange"
    >
      <SelectTrigger aria-label="Select language">
        <span class="vpi-languages option-icon" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="locale in i18nConfig.availableLocales"
            :key="locale.code"
            :value="locale.code"
          >
            {{ locale.label }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>
