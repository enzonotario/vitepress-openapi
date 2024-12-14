<script setup>
import { useTheme } from '../../composables/useTheme'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '../ui/select'

const props = defineProps({
  id: {
    type: String,
    required: false,
  },
})

const themeConfig = useTheme()

const i18nConfig = themeConfig.getI18nConfig()

function onLocaleChange(locale) {
  themeConfig.setI18nConfig({
    locale,
  })
}
</script>

<template>
  <div class="self-center">
    <Select
      :default-value="i18nConfig.locale?.value ?? 'en'"
      :model-value="i18nConfig.locale"
      @update:model-value="onLocaleChange"
    >
      <SelectTrigger>
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
