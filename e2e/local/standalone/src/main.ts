// A plain Vue app (no VitePress) using vitepress-openapi through its Vue plugin.
import { VitepressOpenapi } from 'vitepress-openapi/vue'
import { createApp } from 'vue'
import spec from '../../../../docs/public/openapi.json'
import App from './App.vue'
import { OPERATION_PREFIX } from './routes'
// Same order as VitePress: theme styles first, then the library styles.
import 'vitepress-openapi/dist/standalone.css'
import 'vitepress-openapi/dist/style.css'

createApp(App)
  .use(VitepressOpenapi, {
    spec,
    config: {
      // Operation links in descriptions (`/operations/:operationId`) navigate inside this app.
      markdown: { operationLink: { transformHref: href => href.replace('/operations/', OPERATION_PREFIX) } },
    },
  })
  .mount('#app')
