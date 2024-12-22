import type { Ref } from 'vue'

export interface SandboxData {
  loading: Ref<boolean>
  spec: Ref<Record<string, any>>
  specUrl: Ref<string>
  specLoaded: Ref<boolean>
  previewType: Ref<'spec' | 'oneOperation'>
}
