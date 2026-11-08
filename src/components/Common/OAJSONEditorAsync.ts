import { useI18n } from '@byjohann/vue-i18n'
import { defineAsyncComponent, defineComponent, h } from 'vue'
import OALoadError from './OALoadError.vue'

const OAJSONEditorLoadError = defineComponent({
  setup() {
    const { t } = useI18n()
    return () => h(OALoadError, { message: t('Failed to load the JSON editor.') })
  },
})

const OAJSONEditorLoading = defineComponent({
  setup() {
    const { t } = useI18n()
    return () => h('div', { class: 'text-sm text-muted-foreground' }, t('Loading'))
  },
})

/**
 * Lazy JSON editor: vanilla-jsoneditor + CodeMirror are ~1 MB, so they load only where a JSON input renders.
 */
export const OAJSONEditorAsync = defineAsyncComponent({
  loader: () => import('./OAJSONEditor.vue'),
  loadingComponent: OAJSONEditorLoading,
  errorComponent: OAJSONEditorLoadError,
  // A stalled chunk request ends in the error component instead of an empty area.
  timeout: 30_000,
  // OAProvider wraps operations in <Suspense>; do not hold the docs back while the editor loads.
  suspensible: false,
})
