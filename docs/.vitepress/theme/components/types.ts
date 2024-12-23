import type { Ref } from 'vue'
import type { UseThemeConfig } from '../../../../src/composables/useTheme'

export interface SandboxData {
  loading: Ref<boolean>
  specLoaded: Ref<boolean>
  spec: Ref<Record<string, any>>
  specUrl: Ref<string>
  previewComponent: Ref<'OASpec' | 'OAOperation'>
  sandboxView: Ref<'edit' | 'preview'>
  showSidebar: Ref<boolean>
  operationId: Ref<string | null>
  themeConfig: Ref<UseThemeConfig>
}
