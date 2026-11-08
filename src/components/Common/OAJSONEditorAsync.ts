import { useI18n } from '@byjohann/vue-i18n'
import { defineAsyncComponent, defineComponent, h } from 'vue'
import OALoadError from './OALoadError.vue'

const OAJSONEditorLoadError = defineComponent({
  setup() {
    const { t } = useI18n()
    return () => h(OALoadError, { message: t('Failed to load the JSON editor.') })
  },
})

/**
 * Lazy JSON editor: vanilla-jsoneditor + CodeMirror are ~1 MB, so they load only where a JSON input renders.
 */
export const OAJSONEditorAsync = defineAsyncComponent({
  loader: () => import('./OAJSONEditor.vue'),
  errorComponent: OAJSONEditorLoadError,
  // OAProvider wraps operations in <Suspense>; do not hold the docs back while the editor loads.
  suspensible: false,
})
